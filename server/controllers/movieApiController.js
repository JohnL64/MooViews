const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const movieApiMethods = require('../movieApiMethods');

dotenv.config();
const { api_key } = process.env;

const movieApiController = {};


//-------- QUERY MOVIE WITH USER GIVEN KEYWORD --------- 
movieApiController.search = (req, res, next) => {
  const { keyword, page, content } = req.query;

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${keyword}&page=${page}&include_adult=false&region=US`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        for (let i = 0; i < data.results.length; i += 1) {
          const movie = data.results[i];
          if (!movie.overview) movie.overview = 'The plot is currently unknown.'
          if (i === 8 && content === 'navbar') break;
          if (movie.release_date) {
            movie.release_date = movie.release_date.slice(0, 4);
          } else movie.release_date = 'N/A';
          if (movie.poster_path) movie.poster_path = `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        }
      }
      res.locals.movies = data.results;
      res.locals.numOfPages = data.total_pages;
      return next();
    })
    .catch(err => {
      return next({message: 'Error has occured in movieApiController.search'})
    })
}


//-------- QUERIES FOR MOVIES IN THEATERS AND POPULAR MOVIES FOR HOME PAGE --------
movieApiController.home = async (req, res, next) => {
  const { content, id, page } = req.query;

  const allResults = [];

  function updatePreviewInfo(movies) {
    for (let i = 0; i < movies.length; i += 1) {
      let movie = movies[i];
      movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movie.release_date = movie.release_date.slice(0, 4);
      movie.backdrop_path = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
      movie.genres = movieApiMethods.getGenres(movie.genre_ids);
      allResults.push(movie);
    }
  }

  // Queries for a list of movies that are now playing in theaters for preview.
  if (content === "preview") {
        let urlQuery = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`;
        let urlQueryTwo = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=2&region=US`;

    await fetch(urlQuery)
    .then(res => res.json())
      .then(data => {
        updatePreviewInfo(data.results);
      })
      .catch(err => {
        return next({ message: 'Error has occured when first querying data for home preview in movieApiController.home' });
      })

    fetch(urlQueryTwo)
      .then(res => res.json())
      .then(secondData => {
        updatePreviewInfo(secondData.results);
        res.locals.preview = allResults;
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when second querying data for home preview in movieApiController.home' });
      })
  }

  // Queries for a list of popular movies for Main.
  else if (content === 'main') {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}&region=US`)
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < data.results.length; i += 1) {
          let movie = data.results[i];
          movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          movie.release_date = movie.release_date.slice(0, 4);
          movie.genres = movieApiMethods.getGenres(movie.genre_ids);
        }
        res.locals.main = data.results;
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when first querying data for home main in movieApiController.home' });
      })
  }

  // Queries movie details for general information modal.
  else {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US&append_to_response=release_dates`)
      .then(res => res.json())
      .then(data => {
        let runtime = movieApiMethods.changeRuntimeFormat(data.runtime);
        let rating = movieApiMethods.findMpaaRating(data.release_dates.results);
        res.locals.generalInfo = { runtime, rating };
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when querying data for preview generalInfo in movieApiController.preview' });
      })
  }
}

/*
-------- QUERIES UPCOMING MOVIES FOR COMING SOON PAGE --------
*/
movieApiController.comingSoon = (req, res, next) => {
  const { content, id } = req.query;
  console.log('Content ', content);
  // console.log('Page ', page);

  // Updates spefic data for each movie that will be displayed.
  function updateCSinfo(movie) {
    if (movie.overview === 'Coming Soon') movie.overview = 'The plot is currently unknown.'
    if (movie.poster_path) movie.poster_path = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
    movie.genres = movieApiMethods.getGenres(movie.genre_ids);                      
  }

  if (content === 'comingSoon') {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=1&region=US`)
      .then(res => res.json())
      .then(async data => {
        // Due to the movies received from the movie api not being ordered by release dates all movies from all possible pages must be recieved before sorting movies. The total amount of pages of results is given with the first initial request of coming soon movie data. The total number of pages received is then used to identify how many pages of results we need to make a request for.
        const pages = data.total_pages;
        // Update the first page of movie results.
        for (let i = 0; i < data.results.length; i += 1) {
          updateCSinfo(data.results[i]);
        }
        // Fetch the next pages of results to update and add to total movies list.
        for (let i = 2; i <= pages; i += 1) {
          let currPageResults = await movieApiMethods.allPagesOfUpcoming(i);
          if (typeof currPageResults === 'object') {
            for (movie of currPageResults) {
              updateCSinfo(movie);
              data.results.push(movie);
            }
          } else throw new Error();
        }
        // Once all movies are received, the movies are sorted by their release date in ascending order.
        res.locals.comingSoon = movieApiMethods.sortByRelease(data.results);
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when querying data for ComingSoon in movieApiController.comingSoon' });
      })
  } else {
    // A fetch request is made when more info of a movie in Coming Soon page is requested.
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US&append_to_response=release_dates,credits`)
    .then(res => res.json())
    .then(data => {
      // The runtime format is updated, the MPAA rating and credits is extracted from the movie data once it is received.
      data.runtime === 0 ? data.runtime = 'N/A' : data.runtime = movieApiMethods.changeRuntimeFormat(data.runtime);
      data.MPAA_rating = movieApiMethods.findMpaaRating(data.release_dates.results);
      data.credits = movieApiMethods.topCastAndCrew(data.credits.cast, data.credits.crew);
      const { runtime, MPAA_rating, credits } = data;
      data = { runtime, MPAA_rating, credits };
       res.locals.expandInfo = data;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for ExpandInfo in movieApiController.comingSoon' });
    })
  }
}


/*
-------- QUERIES TOP RATED MOVIES FOR TOP RATED PAGE --------
*/
movieApiController.topRated = (req, res, next) => {
  // Array used to store all movie results from requested pages.
  const topMovies = [];
  // Function that will take in an array of movies (results from one page) and update certain details of the movie and push each movie to topMovies array.
  function updateTRmovies(movies) {
    for (let i = 0; i < movies.length; i  += 1) {
      let movie = movies[i];
      movie.poster_path = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      movie.release_date = movie.release_date.slice(0, 4);
      movie.vote_count = movieApiMethods.newVoteCountFormat(movie.vote_count);
      topMovies.push(movie);
    }
  }

  // Makes a request to API where the movies will be sorted by rating (descending) and where each movie must be rated by at least 5000 users. 
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=5000&with_watch_monetization_types=flatrate`)
    .then(res => res.json())
    .then(async data => {
      updateTRmovies(data.results);
      // Queries for the movies on the next page of results, updates the movie details then is pushed into topMovies array.
      for (let i = 2; i < 6; i += 1) {
        let currPageResult = await movieApiMethods.getTopMovies(i);
        if (typeof  currPageResult === 'object') updateTRmovies(currPageResult);
        else throw new Error();
      }
      res.locals.topRated = topMovies;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for Top Rated in movieApiController.' });
    })
}


/*
-------- QUERIES DETAILS FOR SELECTED MOVIE ON MOVIE INFO PAGE --------
*/
movieApiController.movieInfo = (req, res, next) => {
  const { id } = req.query;
  const dbRating = res.locals.dbRating;

  function isReleased(releaseDate) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const movieMonth = Number(releaseDate.slice(5, 7));
    const movieDay = Number(releaseDate.slice(8, 10));
    const movieYear = Number(releaseDate.slice(0, 4));

    if (movieYear < year) return true;
    else if (movieYear === year && movieMonth < month) return true;
    else if (movieYear === year && (movieMonth === month && movieDay <= day)) return true;
    else return false; 
  }

  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US&append_to_response=release_dates,credits,videos`)
    .then(res => res.json())
    .then(data => {
      data.dbRating = dbRating;
      data.tmdb_vote_count = data.vote_count;
      if (dbRating) {
        data.vote_average = dbRating.rating;
        data.vote_count = dbRating.vote_count;
      };
      if (data.release_dates.results.length > 0) data.rating = movieApiMethods.findMpaaRating(data.release_dates.results);
      data.release_dates = null;
      if (data.release_date) {
        data.year = data.release_date.slice(0, 4);
        data.is_released = isReleased(data.release_date);
      }
      if (data.genres.length) data.genres = movieApiMethods.getGenres(data.genres);
      if (data.poster_path) data.poster_path = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
      if (data.runtime) data.runtime = movieApiMethods.changeRuntimeFormat(data.runtime);
      data.videos = movieApiMethods.getMovieTrailer(data.videos.results);
      data.credits = movieApiMethods.fullCastAndCrew(data.credits.cast, data.credits.crew);
      if (data.vote_count > 999) data.vote_count = movieApiMethods.newVoteCountFormat(data.vote_count);
      if (!data.overview) data.overview = 'The plot is currently unknown.'

      res.locals.movieInfo = data;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for Movie Info in movieApiController.' });
    })
}

module.exports = movieApiController;