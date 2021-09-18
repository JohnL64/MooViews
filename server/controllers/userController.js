const db = require('../model');

const userController = {};

userController.createAccount = (req, res, next) => {
  const { email, username, password } = req.body;
  const createAccountQuery = `
  INSERT INTO users (email, username, password)
  VALUES ($1, $2, $3)
  RETURNING _id`

  const values = [ email, username, password ];
  console.log('________', email, username)
  db.query(createAccountQuery, values, 
    (err, userAdded) => {
      if (err) {
        // res.locals.validAccount = false;
        console.log('\n Error :', err.constraint);
        let errorType = 'Email is already in use';
        if (err.constraint === 'users_username_key') errorType = 'Username is already in use'
        console.log(errorType);
        return next({ message: 'Error has occured at userController.createAccount', errorType })
      }
      console.log(userAdded + '\n');
      res.locals.validAccount = true;
      res.cookie('userID', userAdded.rows[0]._id);
      return next();
    })
}

userController.verifyAccount = (req, res, next) => {
  const { username, password } = req.body;
  const verifyUserQuery = `
  SELECT _id
  FROM users
  WHERE username=$1 AND password=$2`;

  const values = [username, password];

  db.query(verifyUserQuery, values, 
    (err, verifiedUser) => {
      if (err) return next({ message: 'Error has occured at userController.verifyAccount' });
      // console.log('testinggggggg', verifiedUser)
      if (verifiedUser.rows.length === 0) {
        res.locals.errorType = 'Username or password is invalid';
      } else {
        res.cookie('userID', verifiedUser.rows[0]._id, { httpOnly: true });
      }
      return next();
    })
}

module.exports = userController;
