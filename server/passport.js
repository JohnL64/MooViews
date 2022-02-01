const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./model');
const crypto = require('crypto');

const verifyCallback = (username, password, done) => {
  const verifyUserQuery = `
  SELECT _id, password, salt
  FROM users
  WHERE username=$1`;

  const values = [username];

	function validatePassword(password, hash, salt) {
		const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
		return hash === hashVerify;
	}

  db.query(verifyUserQuery, values, 
    (err, verifiedUser) => {
      if (err) return done(err);
      if (verifiedUser.rows.length === 0) {
				return done(null, false);
      } 
			let user = verifiedUser.rows[0];
			const isValid = validatePassword(password, user.password, user.salt);
			if (isValid) return done(null, user);
			else return done(null, false);
    })
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
	console.log('In serializeUser aaaaaaaaaaaa');
	done(null, user._id);
});

passport.deserializeUser((userId, done) => {
	const verifyUserQuery = `
	SELECT *
	FROM users
	WHERE _id=$1`;

	const values = [userId];

	db.query(verifyUserQuery, values, 
		(err, verifiedUser) => {
			if (err) return done(err);
			done(null, verifiedUser.rows[0]);
		})
});