const dotenv = require('dotenv');

dotenv.config();
const { api_key } = process.env;

// Movie api's list of genres
const genresList = { 12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror', 28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller', 80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery', 10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie' }

//-------- METHODS TO CHANGE FORMAT OF MOVIE DATA AND CUSTOM API QUERIES --------

const movieApiMethods = {};


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

movieApiMethods.topCastAndCrew = (castArr, crewArr) => {
  let topCast = '';
  let director = '';
  let numOfDir = 0;
  let directorTitle = 'Director';
  if (castArr.length > 0) {
    for (let i = 0; i < castArr.length; i += 1) {
      if (i === 3) break;
      topCast ? topCast += ', ' + castArr[i].name : topCast += castArr[i].name;
    }
  }
  if (crewArr.length > 0) {
    for (let i = 0; i < crewArr.length; i += 1) {
      if (crewArr[i].job === "Director") {
        director ? director += ', ' + crewArr[i].name : director += crewArr[i].name;
        numOfDir += 1;
      }
    }
  }
  if (!topCast) topCast = 'N/A';
  if (!director) director = 'N/A';
  if (numOfDir > 1) directorTitle = 'Directors';
  return { topCast, director, directorTitle };
}

movieApiMethods.fullCastAndCrew = (cast, crew, queryingFor) => {
  const updatedCast = [];
  const updatedCrew = {
    Director: [],
    Writer: [],
    Producer: []
  };
  for (let i = 0; i < cast.length; i += 1) {
    if (i === 16 || (queryingFor === 'moreInfo' && i === 3)) break;
    if (cast[i].profile_path) cast[i].profile_path = `https://image.tmdb.org/t/p/w185/${cast[i].profile_path}`;
    const { id, name, character, profile_path } = cast[i];
    updatedCast.push({ id, name, character, profile_path });
  }

  for (const member of crew) {
    if (queryingFor !== 'moreInfo') {
      if (member.job === 'Producer' || member.job === 'Writer' || member.job === 'Director') updatedCrew[member.job].push(member.name);
      else if (member.job === 'Screenplay') updatedCrew.Writer.push(member.name);
    } else {
      if (member.job === 'Director') updatedCrew[member.job].push(member.name);
    }
  }
  return { updatedCast, updatedCrew };
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

movieApiMethods.getMovieTrailer = (videoResults) => {
  let trailer;
  let teaser;
  for (const video of videoResults) {
    // If both trailer and teaser are assigned a src string we no longer need to keep iterating. So break out of the loop
    if (trailer && teaser) break;
    if (video.type === 'Trailer' && !trailer) trailer = `https://www.youtube.com/embed/${video.key}`;
    if (video.type === 'Teaser' && !teaser) teaser = `https://www.youtube.com/embed/${video.key}`;
  }

  if (trailer) return trailer;
  else if (teaser) return teaser;
  else return null;
}

movieApiMethods.newDateFormat = (date) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[Number(date.slice(5, 7)) - 1]} ${Number(date.slice(8, 10))}, ${date.slice(0, 4)}`;
}


/************ METHODS TO ENSURE THE CORRECT DATA IS SENT TO THE CLIENT SIDE FOR ALL PAGES ************/

movieApiMethods.sortByRelease = (moviesArr) => {
  const moviesByRelease = [];
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let year = date.getFullYear();

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
        daysByYear[mYear] = {};
      }
      dateObj[mYear] = {};
    };
    if (!dateObj[mYear].hasOwnProperty(mMonth)) {
      monthsByYear[mYear].push(mMonth);
      dateObj[mYear][mMonth] = {};
    };
    if (!dateObj[mYear][mMonth].hasOwnProperty(mDay)) {
      if (daysByYear[mYear].hasOwnProperty(mMonth)) daysByYear[mYear][mMonth].push(mDay);
      else daysByYear[mYear][mMonth] = [mDay];
      dateObj[mYear][mMonth][mDay] = [];
    };
    dateObj[mYear][mMonth][mDay].push(moviesArr[i]);
  }

  if (!monthsByYear[year]) year += 1;

  while (monthsByYear[year]) {
    monthsByYear[year].sort((a, b) => a - b);
    for (const month of monthsByYear[year]) {
      daysByYear[year][month].sort((a, b) => a - b);
      for (const day of daysByYear[year][month]) {
        for (const movie of dateObj[year][month][day]) {
          moviesByRelease.push(movie);
        }
      }
    }
    year += 1;
  }
  return moviesByRelease;
}

// Fetches movies for requested page that will be dislayed on Coming Soon page.
movieApiMethods.allPagesOfUpcoming = async (page) => {
  let currPageResults;
  await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=${page}&region=US`)
    .then(res => res.json())
    .then(data => {
      currPageResults = data.results;
      if (!data.results) throw new Error();
    })
    .catch(err => {
      currPageResults = "Error";
    })
  return currPageResults;
}

// Fetches movies for requested page that will be displayed on Top Rated page.
movieApiMethods.getTopMovies = async (page) => {
  let currPageResults;
  await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=vote_average.desc&
  include_adult=false&include_video=false&page=${page}&vote_count.gte=5000&with_watch_monetization_types=flatrate`)
    .then(res => res.json())
    .then(data => {
      currPageResults = data.results;
      if (!data.results) throw new Error();
    })
    .catch(() => {
      currPageResults = 'Error';                        
    })
  return currPageResults;
} 

movieApiMethods.getMoreSimilarMovies = async (page, genres) => {
  let results;
  await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate&with_genres=${genres}`)
    .then(res => res.json())
    .then(data => {
      results = data.results;
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for Movie Info in movieApiMethods.getMoreSimilarMovies' });
    })
  return results;
}
module.exports = movieApiMethods;