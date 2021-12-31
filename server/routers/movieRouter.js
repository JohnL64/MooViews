const express = require('express');
const router = express.Router();
const movieApiController = require('../controllers/movieApiController');
const movieDbController = require('../controllers/movieDbController');

// searches for movies with user given keyword
router.get('/search', movieApiController.search, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for all components in Home page
router.get('/home', movieApiController.home, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Coming Soon page
router.get('/coming-soon', movieApiController.comingSoon, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Top Rated page
router.get('/top-rated', movieApiController.topRated, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Movie Info page
router.get('/movie-info', movieDbController.dbMovieRating, movieApiController.movieInfo, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries database for user rating for selected movie
router.get('/user-rating', movieDbController.getUserMovieRating, (req, res) => {
  res.status(200).json(res.locals);
})

module.exports = router;