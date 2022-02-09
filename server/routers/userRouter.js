const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');


router.post('/createAccount', userController.createAccount, userController.verifyAccount);

router.post('/verifyAccount', userController.verifyAccount);


module.exports = router;