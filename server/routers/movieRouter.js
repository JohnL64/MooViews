const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// searches for movies with user given keyword
router.get('/search', movieController.search, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for all components in Home page
router.get('/home', movieController.home, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Coming Soon page
router.get('/coming-soon', movieController.comingSoon, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Top Rated page
router.get('/top-rated', movieController.topRated, (req, res) => {
  res.status(200).json(res.locals);
})

// queries data for Movie Info page
router.get('/movie-info', movieController.movieInfo, (req, res) => {
  res.status(200).json(res.locals);
})

module.exports = router;