const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/createAccount', userController.createAccount, (req, res) => {
  res.status(200).json(res.locals)
})

router.post('/verifyAccount', userController.verifyAccount, (req, res) => {
  res.status(200).json(res.locals)
})

module.exports = router