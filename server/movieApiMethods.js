const dotenv = require('dotenv');

dotenv.config();
const { api_key } = process.env;

// Movie api's list of genres
const genresList = { 12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror', 28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller', 80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery', 10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie' }

//-------- METHODS TO CHANGE FORMAT OF MOVIE DATA AND CUSTOM API QUERIES --------

const movieApiMethods = {};


// Modifies the format of the received movie data for specified movie details
movieApiMethods.moviesInfoUpdate = (results, content, allResults) => {
  if (Array.isArray(results)) {
    for (let i = 0; i < results.length; i += 1) {
      let movie = results[i];
      movie.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movie.release_date = movie.release_date.slice(0, 4);
      if (content !== 'topRated') {
        movie.backdrop_path = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
        movie.genres = movieApiMethods.getGenres(movie.genre_ids);
      }
      if (content === 'topRated') {
        if (i === 0 && allResults.length < 1) {
          console.log(movie.vote_count);
          console.log(movieApiMethods.newVoteCountFormat(movie.vote_count))
        }
        movie.vote_count = movieApiMethods.newVoteCountFormat(movie.vote_count);
        const { id, poster_path, title, release_date, vote_average, vote_count } = movie;
        movie = { id, poster_path, title, release_date, vote_average, vote_count }
      }
      if (allResults) allResults.push(movie);
    }
  } else if (content === 'comingSoon') {
    if (results.overview === 'Coming Soon') results.overview = 'The plot is currently unknown.'
    if (results.poster_path) results.poster_path = `https://image.tmdb.org/t/p/w342${results.poster_path}`;
    results.genres = movieApiMethods.getGenres(results.genre_ids);
  } else if (content === 'expandInfo') {
    results.runtime === 0 ? results.runtime = 'N/A' : results.runtime = movieApiMethods.changeRuntimeFormat(results.runtime);
    results.MPAA_rating = movieApiMethods.findMpaaRating(results.release_dates.results);
    results.credits = movieApiMethods.getTopCast(results.credits.cast, results.credits.crew);
    const { runtime, MPAA_rating, credits } = results;
    results = { runtime, MPAA_rating, credits };
  }
  // else {
  //   results.poster_path = `https://image.tmdb.org/t/p/w500/${results.poster_path}`;
  //   results.backdrop_path = `https://image.tmdb.org/t/p/w780/${results.backdrop_path}`;
  //   if (content !== 'comingSoon') results.release_date = results.release_date.slice(0, 4);
  //   results.runtime = movieApiMethods.changeRuntimeFormat(results.runtime);
  //   results.MPAA_rating = movieApiMethods.findMpaaRating(results.release_dates.results)
  //   results.genres = movieApiMethods.getGenres(results.genres);
  //   const {id, title, MPAA_rating, runtime, release_date, genres, vote_average, overview, poster_path} = results;
  //   return {id, title, MPAA_rating, runtime, release_date, genres, vote_average, overview, poster_path};
  // }
  return results;
}



/************ METHODS TO CHANGE THE FORMAT OF THE DATA RECEIVED FROM MOVIE API ************/
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
        if (release.certification) {
          rating = release.certification;
          break;
        }
      }
      // If none of the releases have a rating 'Not Rated' will be used
      if (!rating || rating === 'NR') rating = 'Not Rated';
      break;
    }
  }
  return rating;
}

movieApiMethods.getGenres = (genres) => {
  let newGenreFormat = '';
  for (let genre of genres) {
    let currGenre = '';
    if (typeof genres[0] !== 'number') currGenre = genre.name;
    else currGenre = genresList[genre];
    if (currGenre === 'Science Fiction') currGenre = 'Sci-Fi'
    !newGenreFormat ? newGenreFormat += currGenre : newGenreFormat += `/${currGenre}`;
  }
  return newGenreFormat;
}

movieApiMethods.getTopCast = (castArr, crewArr) => {
  // console.log(castArr[0].name);
  // console.log(castArr);
  let topCast = '';
  let director = '';
  let numOfDir = 0;
  let directorTitle = 'Director';
// console.log(topCast, director, directorTitle) 
  if (castArr.length > 0) {
    for (let i = 0; i < castArr.length; i += 1) {
      if (i === 3) break;
      // console.log(topCast, director, directorTitle);
      topCast ? topCast += ', ' + castArr[i].name : topCast += castArr[i].name;
    }
  }
  // console.log(topCast, director, directorTitle)  
  if (crewArr.length > 0) {
    for (let i = 0; i < crewArr.length; i += 1) {
      if (crewArr[i].job === "Director") {
        // console.log(topCast, director, directorTitle)
        director ? director += ', ' + crewArr[i].name : director += crewArr[i].name;
        numOfDir += 1;
      }
    }
  }
  if (!topCast) topCast = 'N/A';
  if (!director) director = 'N/A';
  if (numOfDir > 1) directorTitle = 'Directors';
  // console.log(topCast, director, directorTitle)
  return { topCast, director, directorTitle };
}

movieApiMethods.newVoteCountFormat = (voteCount) => {
  let countBy1000 = voteCount / 1000;
  let wholeCountNum = Math.floor(countBy1000);
  // console.log("In voteCount method ", countBy1000, wholeCountNum);
  if (countBy1000 < 100) {
    // console.log('If count is less than 100 ', (countBy1000 - wholeCountNum) * 10)
    let decimal = Math.floor((countBy1000 - wholeCountNum) * 10);
    // console.log('Decimal ', decimal);
    if (decimal > 0) wholeCountNum = wholeCountNum + (decimal / 10);
  }
  return wholeCountNum + 'K';
}

// movieApiMethods.queryMovieDetails = async (detailObj) => {
//   let urlQuery = `https://api.themoviedb.org/3/movie/${detailObj.id}?api_key=${api_key}&language=en-US&append_to_response=release_dates`

//   let movieDetails;
//   const { content } = detailObj;

//   if (detailObj.credits) urlQuery += ',credits'
  
//   await fetch(urlQuery)
//     .then(res => res.json())
//     .then(data => {
//       movieDetails = movieApiMethods.moviesInfoUpdate(data, content);
//     })
//     .catch(err => {
//       movieDetails = "An error occured when querying for movie details for Main"
//     })
//   return movieDetails;
// }



/************ METHODS TO ENSURE THE CORRECT DATA IS SENT TO THE CLIENT SIDE FOR ALL PAGES ************/

movieApiMethods.sortByRelease = (moviesArr) => {
  const moviesByRelease = [];
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const dateObj = {};
  const monthsByYear = {};
  const daysByYear = {};

  for (let i = 0; i < moviesArr.length; i += 1) {
    const mYear = Number(moviesArr[i].release_date.slice(0, 4));
    const mMonth = Number(moviesArr[i].release_date.slice(5, 7));
    const mDay = Number(moviesArr[i].release_date.slice(8, 10));
    if (mYear < year || (mYear === year && mMonth < month) || ((mYear === year && mMonth === month) && mDay <= day)) continue;
    if (!dateObj.hasOwnProperty(mYear)) {
      if (!monthsByYear.hasOwnProperty(mYear)) {
        monthsByYear[mYear] = [];
        daysByYear[mYear] = [];
      }
      dateObj[mYear] = {};
    };
    if (!dateObj[mYear].hasOwnProperty(mMonth)) {
      monthsByYear[mYear].push(mMonth);
      dateObj[mYear][mMonth] = {};
    };
    if (!dateObj[mYear][mMonth].hasOwnProperty(mDay)) {
      daysByYear[mYear].push(mDay);
      dateObj[mYear][mMonth][mDay] = [];
    };
    dateObj[mYear][mMonth][mDay].push(moviesArr[i])
  }

  for (const key in monthsByYear) {
    monthsByYear[key].sort((a, b) => a - b);
    for (const month of monthsByYear[key]) {
      daysByYear[key].sort((a, b) => a - b);
      for (const day of daysByYear[key]) {
        for (const movie of dateObj[key][month][day]) {
          moviesByRelease.push(movie);
        }
      }
    }
  }

  return moviesByRelease;
}

movieApiMethods.allPagesOfUpcoming = async (page) => {
  let currPageResults;
  await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=${page}&region=US`)
    .then(res => res.json())
    .then(data => {
      currPageResults = data.results
    })
    .catch(err => {
      currPageResults = "An error occured when querying for movies in all pages of upcoming movies request";
    })
  return currPageResults;
}

movieApiMethods.getTopMovies = async (page, topMovies) => {
  await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_average.desc&
  include_adult=false&include_video=false&page=${page}&vote_count.gte=5000&with_watch_monetization_types=flatrate`)
    .then(res => res.json())
    .then(data => {
      movieApiMethods.moviesInfoUpdate(data.results, 'topRated', topMovies);
    })
} 

module.exports = movieApiMethods;