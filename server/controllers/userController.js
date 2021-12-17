const db = require('../model');
const crypto = require('crypto');
const passport = require('passport');

const userController = {};


// CREATING ACCOUNT - query to database to store valid users data when creating an account
userController.createAccount = (req, res, next) => {
  const { email, username, password } = req.body;
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  const createAccountQuery = `
  INSERT INTO users (email, username, password, salt)
  VALUES ($1, $2, $3, $4)
  RETURNING _id`

  const values = [ email, username, genHash, salt];

  db.query(createAccountQuery, values, 
    (err, userAdded) => {
      if (err) {
        let errorType = 'Email is already in use';
        if (err.constraint === 'users_username_key') errorType = 'Username is already in use'
        return next({ message: 'Error has occured at userController.createAccount', errorType })
      }
      res.locals.validAccount = true;
      return next();
    })
}


// LOGGING IN - query to database to ensure the user given data matches with the data stored in DB
userController.verifyAccount = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) res.locals.errorType = 'Username or password is invalid';
    if (user) {
      res.locals.isVerified = true;
      req.logIn(user, (err) => {
        if (err) return next(err);
      })
    }
    res.status(200).json(res.locals);
  }) (req, res, next);
}

module.exports = userController;
