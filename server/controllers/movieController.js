const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const movieApiMethods = require('../movieApiMethods');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


//-------- QUERY MOVIE WITH USER GIVEN KEYWORD --------- 
movieController.search = (req, res, next) => {
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
      return next({message: 'Error has occured in movieController.search'})
    })
}


//-------- QUERIES MOVIES AND MOVIE DETAILS FOR HOME --------
movieController.home = async (req, res, next) => {
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
        return next({ message: 'Error has occured when first querying data for home preview in movieController.home' });
      })

    fetch(urlQueryTwo)
      .then(res => res.json())
      .then(secondData => {
        updatePreviewInfo(secondData.results);
        res.locals.preview = allResults;
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when second querying data for home preview in movieController.home' });
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
        return next({ message: 'Error has occured when first querying data for home main in movieController.home' });
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
        return next({ message: 'Error has occured when querying data for preview generalInfo in movieController.preview' });
      })
  }
}

/*
-------- QUERIES UPCOMING MOVIES FOR COMING SOON --------
*/
movieController.comingSoon = (req, res, next) => {
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
        // Fetch  for all movies first fetch for Coming Soon movies 
        for (let i = 2; i <= pages; i += 1) {
          let currPageResults = await movieApiMethods.allPagesOfUpcoming(i);
          for (movie of currPageResults) {
            updateCSinfo(movie);
            data.results.push(movie);
          }
        }
        // Once all movies are received, the movies are sorted by their release date in ascending order.
        res.locals.comingSoon = movieApiMethods.sortByRelease(data.results);
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when querying data for ComingSoon in movieController.comingSoon' });
      })
  } else {
    // A fetch request is made when more info of a movie in Coming Soon page is requested.
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US&append_to_response=release_dates,credits`)
    .then(res => res.json())
    .then(data => {
      // The runtime format is updated, the MPAA rating and credits is extracted from the movie data once it is received.
      data.runtime === 0 ? data.runtime = 'N/A' : data.runtime = movieApiMethods.changeRuntimeFormat(data.runtime);
      data.MPAA_rating = movieApiMethods.findMpaaRating(data.release_dates.results);
      data.credits = movieApiMethods.getTopCast(data.credits.cast, data.credits.crew);
      const { runtime, MPAA_rating, credits } = data;
      data = { runtime, MPAA_rating, credits };
       res.locals.expandInfo = data;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for ExpandInfo in movieController.comingSoon' });
    })
  }
}


/*
-------- QUERIES TOP RATED MOVIES FOR TOP RATED --------
*/
movieController.topRated = (req, res, next) => {
  const topMovies = [];
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=5000&with_watch_monetization_types=flatrate`)
    .then(res => res.json())
    .then(async data => {
      movieApiMethods.moviesInfoUpdate(data.results, 'topRated', topMovies)
      for (let i = 2; i < 6; i += 1) {
        await movieApiMethods.getTopMovies(i, topMovies);
      }
      res.locals.topRated = topMovies;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for Top Rated in movieController.' });
    })
}

movieController.movieInfo = (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US&append_to_response=release_dates,credits,videos`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
}

module.exports = movieController;