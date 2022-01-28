const express = require('express');
const router = express.Router();
const movieApiController = require('../controllers/movieApiController');
const movieDbController = require('../controllers/movieDbController');

// Searches for movies with user given keyword.
router.get('/search', movieApiController.search, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries data for all components in Home page.
router.get('/home', movieApiController.home, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries data for Coming Soon page.
router.get('/coming-soon', movieApiController.comingSoon, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries data for Top Rated page.
router.get('/top-rated', movieApiController.topRated, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries data for Movie Info page.
router.get('/movie-info', movieDbController.dbMovieRating, movieApiController.movieInfo, (req, res) => {
  res.status(200).json(res.locals);
})

// Adds movie to database.
router.post('/movie-info', movieDbController.addMovie, (req, res) => {
  res.status(200).json(res.locals);
})

// Updates movie in database.
router.patch('/movie-info', movieDbController.updateMovie, (req, res) => {
  res.status(200).json(res.locals);
})

// Queries database for user rating for selected movie.
router.get('/user-rating', movieDbController.getUserMovieRating, (req, res) => {
  res.status(200).json(res.locals);
})

// Adds user rating or review and update movie's average score.
router.post('/user-rating', movieDbController.addUserMovieRating, (req, res) => {
  res.status(200).json(res.locals);
})

// Update user rating or review and update movie's average score.
router.patch('/user-rating', movieDbController.updateUserMovieRating, (req, res) => {
  res.status(200).json(res.locals);
})

// Update user rating or review and update movie's average score.
router.get('/user-reviews', movieDbController.getUserReviews, (req, res) => {
  res.status(200).json(res.locals);
})

module.exports = router;