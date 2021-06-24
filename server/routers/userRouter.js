const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/createAccount', userController.createAccount, (req, res) => {
  res.status(200).json({ message: 'Account has been created' })
})

router.post('/verifyAccount', userController.verifyAccount, (req, res) => {
  res.status(200).json(res.locals)
})

module.exports = router;