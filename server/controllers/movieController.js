const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const movieApiMethods = require('./movieApiMethods');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


//-------- MOVIE QUERY WITH KEYWORD --------- query to movie api to return movies that match with the user given keyword
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


//-------- MOVIE AND MOVIE DETAILS QUERIES FOR PREVIEW --------
movieController.preview = (req, res, next) => {
  const { content, id } = req.query;
 
  // Queries movies for preview in movies page
  if (content === "home") {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`)
    .then(res => res.json())
    .then(data => {
      res.locals.preview = movieApiMethods.moviesInfoUpdate(data.results);
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for home preview in movieController.preview' });
    })
  }

  // Queries movie details for general information popup box
  else if (content === 'generalInfo') {
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
  console.log('page ', page);
  let urlQuery;

  if (content === 'home') urlQuery = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}&region=US`;

  fetch(urlQuery)
    .then(res => res.json())
    .then(async data => {
      // console.log(data);
      // const mainContent = {};
      for (let i = 0; i < data.results.length; i += 1) {
        data.results[i] = await movieApiMethods.queryMovieDetails({ id: data.results[i].id})
      }
      // data.results[0] = await movieApiMethods.queryMovieDetails({ id: data.results[0].id})
      res.locals.main = data.results;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for home main in movieController.preview' });
    })
}

module.exports = movieController;