const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const movieApiMethods = require('./movieApiMethods');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


//-------- QUERY MOVIE WITH USER GIVEN KEYWORD --------- 
movieController.search = (req, res, next) => {
  // function will send only eight movies to render in search results. Ensures all movies will have a release date and will modify release dates to store just the year.
  function changeDates(results) {
    const updatedResults = [];
    for (let i = 0; i < results.length; i += 1) {
      if (updatedResults.length > 7) break;
      if (results[i].release_date) {
        results[i].release_date = results[i].release_date.slice(0, 4);
        updatedResults.push(results[i]);
      }
    }
    return updatedResults;
  }

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${req.query.keyword}`)
    .then(res => res.json())
    .then(data => {
      const updatedMovies = changeDates(data.results);
      res.locals.movies = updatedMovies;
      return next();
    })
    .catch(err => {
      return next({message: 'Error has occured in movieController.search'})
    })
}


//-------- QUERIES MOVIES AND MOVIE DETAILS FOR PREVIEW --------
movieController.preview = async (req, res, next) => {
  const { content, id } = req.query;

  let urlQuery;
  let urQueryTwo;
  // let firstResult;
  // let secondResult;
  const allResults = [];

  // Queries movies for preview in movies page
  if (content !== "generalInfo") {
    switch(content) {
      case "home":
        urlQuery = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`;
        urlQueryTwo = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=2&region=US`;
        break;
      case "upcoming":
        urlQuery = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=1&region=US`;
        urlQueryTwo = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=2&region=US`;
    }

    await fetch(urlQuery)
    .then(res => res.json())
      .then(data => {
        movieApiMethods.moviesInfoUpdate(data.results, content, allResults);
      })
      .catch(err => {
        return next({ message: 'Error has occured when first querying data for home preview in movieController.preview' });
      })

    fetch(urlQueryTwo)
      .then(res => res.json())
      .then(secondData => {
        movieApiMethods.moviesInfoUpdate(secondData.results, content, allResults);
        res.locals.preview = allResults;
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when second querying data for home preview in movieController.preview' });
      })
  }

  // Queries movie details for general information popup box
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
-------- QUERY FOR POPULAR MOVIES AND DETAILS OF EACH MOVIE FOR MAIN --------
*/
movieController.main = (req, res, next) => {
  const { content, page } = req.query;
  console.log('Content ', content);
  console.log('Page ', page);
  console.log('Body', Object.keys(req.body).length < 1);

  let urlQuery;
  if (content === 'home') urlQuery = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}&region=US`;
  else if (content === 'comingSoon') urlQuery = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=${page}&region=US`;

  fetch(urlQuery)
    .then(res => res.json())
    .then(async data => {
      if (content === 'comingSoon') {
        let pages = data.total_pages;
        for (let i = 2; i <= pages; i += 1) {
          let currPageResults = await movieApiMethods.allPagesOfUpcoming(i);
          for (movie of currPageResults) {
            data.results.push(movie);
          }
        }
        data.results = movieApiMethods.sortByRelease(data.results);
      } 
      if (content === 'comingSoon') {
        for (let i = 0; i <= 19; i += 1) {
          let orgReleaseDate = data.results[i].release_date;
          data.results[i] = await movieApiMethods.queryMovieDetails({ id: data.results[i].id, content: content})
          data.results[i].release_date = orgReleaseDate;
        }
      } else {
        for (let i = 0; i < data.results.length; i += 1) {
          data.results[i] = await movieApiMethods.queryMovieDetails({ id: data.results[i].id, content: content})
        }
      }
      res.locals.main = data.results;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for home main in movieController.preview' });
    })
}

movieController.changeCSpage = async (req, res, next) => {
  const { allPages, firstMovie, lastMovie } = req.body;
  const content = req.query.content;
  
  for (let i = firstMovie; i <= lastMovie; i += 1) {
    let orgReleaseDate = allPages[i].release_date;
    allPages[i] = await movieApiMethods.queryMovieDetails({ id: allPages[i].id, content: content})
    if (typeof allPages[i] === 'string') return next({ message: 'Error had occured when querying movie details for different page for Coming Soon in movieController.changeCSpage'})
    allPages[i].release_date = orgReleaseDate;
  }
  res.locals.updatedReqPage = allPages;
  return next();
}

module.exports = movieController;