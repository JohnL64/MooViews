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

// queries data for Main content
router.get('/main', movieController.main, (req, res) => {
  res.status(200).json(res.locals);
})

router.post('/changeCSpage', movieController.changeCSpage, (req, res) => {
  res.status(200).json(res.locals);
})
// router.post('/verifyAccount', userController.verifyAccount, (req, res) => {
//   res.status(200).json(res.locals)
// })

module.exports = router;