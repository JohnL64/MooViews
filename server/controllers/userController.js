const db = require('../model');

const userController = {};

userController.createAccount = (req, res, next) => {
  const { username, password } = req.body;
  const createAccountQuery = `
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING _id`

  const values = [username, password];

  db.query(createAccountQuery, values, 
    (err, userAdded) => {
      if (err) return next({ message: 'Error has occured at userController.createAccount' })
      console.log(userAdded);
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
        res.locals.verified = false;
      } else {
        res.locals.verified = true;
        res.cookie('userID', verifiedUser.rows[0]._id);
      }
      return next();
    })
}

module.exports = userController;
