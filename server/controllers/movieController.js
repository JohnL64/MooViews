const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');

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

//-------- METHODS TO CHANGE FORMAT OF RECEIVED MOVIE DATA --------

// Modifies values for poster and backdrop images to urls be able to render in Preview. Modified release date to store only the year of release.
const moviesInfoUpdate = (results) => {
  for (let i = 0; i < results.length; i += 1) {
    results[i].poster_path = `https://image.tmdb.org/t/p/w500/${results[i].poster_path}`;
    results[i].backdrop_path = `https://image.tmdb.org/t/p/w780/${results[i].backdrop_path}`;
    results[i].release_date = results[i].release_date.slice(0, 4);
  }
  return results;
}

// Modifies the runtime to desired format
const changeRuntimeFormat = (runtime) => {
  if (runtime < 60) return `${runtime}min`;
  let newFormat = '';
  const hours = Math.floor(runtime / 60);
  const mins = runtime - (hours * 60);
  if (hours >= 1) newFormat += `${hours}h`;
  if (mins >= 1) {
    hours < 1 ? newFormat += `${mins}min`: newFormat += ` ${mins}min`;
  }
  return newFormat;
}

// Finds the MPAA rating for US release
const findMpaaRating = (releaseDatesResults) => {
  let rating;
  for (let location of releaseDatesResults) {
    if (location.iso_3166_1 === 'US') {
      // Searches the movie releases and ratings in US. Looks for the first release with a given MPAA rating and the value is used in Preview
      for (let release of location.release_dates) {
        if (release.certification) rating = release.certification;
        break;
      }
      // If none of the releases have a rating 'Not Rated' will be used
      if (!rating) rating = 'Not Rated';
      break;
    }
  }
  return rating;
}

//-------- MOVIE AND MOVIE DETAILS QUERIES FOR PREVIEW --------
movieController.preview = (req, res, next) => {
  const { content, id } = req.query;
 
  // Queries movies for preview in movies page
  if (content === "home") {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`)
    .then(res => res.json())
    .then(data => {
      res.locals.preview = moviesInfoUpdate(data.results);
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
        let runtime = changeRuntimeFormat(data.runtime);
        let rating = findMpaaRating(data.release_dates.results);
        res.locals.generalInfo = { runtime, rating };
        return next();
      })
      .catch(err => {
        return next({ message: 'Error has occured when querying data for preview generalInfo in movieController.preview' });
      })
  }
}

movieController.main = (req, res, next) => {
  const { content, page } = req.query;
  console.log('page ', page);
  let urlQuery;

  if (content === 'home') urlQuery = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}&region=US`;

  fetch(urlQuery)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      res.locals.main = data.results;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for home main in movieController.preview' });
    })
}

module.exports = movieController;