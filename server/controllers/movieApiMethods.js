const dotenv = require('dotenv');

dotenv.config();
const { api_key } = process.env;

// Movie api's list of genres
const genres = { 12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror', 28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller', 80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery', 10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie' }

//-------- METHODS TO CHANGE FORMAT OF MOVIE DATA AND CUSTOM API QUERIES --------

const movieApiMethods = {};


// Modifies the format of the received movie data for specified movie details
movieApiMethods.moviesInfoUpdate = (results) => {
  if (Array.isArray(results)) {
    for (let i = 0; i < results.length; i += 1) {
      results[i].poster_path = `https://image.tmdb.org/t/p/w500/${results[i].poster_path}`;
      results[i].backdrop_path = `https://image.tmdb.org/t/p/w780/${results[i].backdrop_path}`;
      results[i].release_date = results[i].release_date.slice(0, 4);
    }
  } 
  else {
    results.poster_path = `https://image.tmdb.org/t/p/w500/${results.poster_path}`;
    results.backdrop_path = `https://image.tmdb.org/t/p/w780/${results.backdrop_path}`;
    results.release_date = results.release_date.slice(0, 4);
    results.runtime = movieApiMethods.changeRuntimeFormat(results.runtime);
    results.MPAA_rating = movieApiMethods.findMpaaRating(results.release_dates.results)
  }
  return results;
}

// Modifies the runtime to desired format
movieApiMethods.changeRuntimeFormat = (runtime) => {
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
movieApiMethods.findMpaaRating = (releaseDatesResults) => {
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

movieApiMethods.queryMovieDetails = async (detailObj) => {
  let urlQuery = `https://api.themoviedb.org/3/movie/${detailObj.id}?api_key=${api_key}&language=en-US&append_to_response=release_dates`

  let movieDetails;

  if (detailObj.credits) urlQuery += ',credits'
  
  await fetch(urlQuery)
    .then(res => res.json())
    .then(data => {
      movieDetails = movieApiMethods.moviesInfoUpdate(data);
    })
    .catch(err => {
      movieDetails = "An error occured when querying for movie details for Main"
    })
  return movieDetails;
}

// 



module.exports = movieApiMethods;