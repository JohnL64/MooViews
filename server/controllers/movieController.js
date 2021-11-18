const fetch = require('isomorphic-fetch');
const dotenv = require('dotenv');
const movieApiMethods = require('./movieApiMethods');

dotenv.config();
const { api_key } = process.env;

const movieController = {};


//-------- QUERY MOVIE WITH USER GIVEN KEYWORD --------- 
movieController.search = (req, res, next) => {
  // Function will send only eight movies to render in search results. Ensures all movies will have a release date and will modify release dates to store just the year.
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


//-------- QUERIES MOVIES AND MOVIE DETAILS FOR HOME --------
movieController.home = async (req, res, next) => {
  const { content, id, page } = req.query;

  const allResults = [];

  // Queries for a list of movies that are now playing in theaters for preview.
  if (content === "preview") {
        let urlQuery = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1&region=US`;
        let urlQueryTwo = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=2&region=US`;

    await fetch(urlQuery)
    .then(res => res.json())
      .then(data => {
        movieApiMethods.moviesInfoUpdate(data.results, content, allResults);
      })
      .catch(err => {
        return next({ message: 'Error has occured when first querying data for home preview in movieController.home' });
      })

    fetch(urlQueryTwo)
      .then(res => res.json())
      .then(secondData => {
        movieApiMethods.moviesInfoUpdate(secondData.results, content, allResults);
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
        res.locals.main = movieApiMethods.moviesInfoUpdate(data.results, content);
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
  const { content, page } = req.query;
  console.log('Content ', content);
  console.log('Page ', page);
  console.log('Body', Object.keys(req.body).length < 1);

  fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=${page}&region=US`)
    .then(res => res.json())
    .then(async data => {
      // const datesObj = {};
      const pages = data.total_pages;
      for (let i = 0; i < data.results.length; i += 1) {
        data.results[i] = movieApiMethods.moviesInfoUpdate(data.results[i], content);
      }
      for (let i = 2; i <= pages; i += 1) {
        let currPageResults = await movieApiMethods.allPagesOfUpcoming(i);
        for (movie of currPageResults) {
          data.results.push(movieApiMethods.moviesInfoUpdate(movie, content));
        }
      }
      data.results = movieApiMethods.sortByRelease(data.results);
      res.locals.comingSoon = data.results;
      return next();
    })
    .catch(err => {
      return next({ message: 'Error has occured when querying data for ComingSoon in movieController.comingSoon' });
    })
}

module.exports = movieController;