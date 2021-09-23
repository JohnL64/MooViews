const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


// MOVIE SEARCH WITH KEYWORD - request to movie api to return movies matching with user given keyword
movieController.search = (req, res, next) => {
  // function to change the dates of the movie data receieved from api
  function changeDates(results) {
    const updatedResults = results.filter(movie => {
      if (movie.release_date) {
        movie.release_date = movie.release_date.slice(0, 4);
        return movie;
      }
    })
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

module.exports = movieController;