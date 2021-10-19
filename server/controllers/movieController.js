const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


// MOVIE SEARCH WITH KEYWORD - request to movie api to return movies matching with user given keyword
movieController.search = (req, res, next) => {
  // function to change the dates of the movie data receieved from api
  function changeDates(results) {
    // new list of movies to be returned
    const updatedResults = [];
    // iterate through the movies returned from movie API
    for (let i = 0; i < results.length; i += 1) {
      // making sure data only for 8 movies are sent back with dates changed
      if (updatedResults.length > 7) break;
      if (results[i].release_date) {
        results[i].release_date = results[i].release_date.slice(0, 4);
        updatedResults.push(results[i]);
      }
    }
    return updatedResults;
  }

  // make a get request to movie api with the user inputted value as the keyword to search
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


movieController.preview = (req, res, next) => {
  const { content } = req.query;
  console.log(content);

  function selectedMoviesAndUpdate(results) {
    const selected = [];
    for (let i = 0; i < results.length; i += 1) {
      if (i > 29) break;
      // if (results[i].title.length > )
      results[i].poster_path = `https://image.tmdb.org/t/p/w500/${results[i].poster_path}`
      selected.push(results[i]);
    }
    return selected;
  }

  if (content === "home") {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`)
    .then(res => res.json())
    .then(data => {
      console.log(data.results.length)

      res.locals.preview = selectedMoviesAndUpdate(data.results);
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured in movieController.preview' });
    })
  }
}

module.exports = movieController;