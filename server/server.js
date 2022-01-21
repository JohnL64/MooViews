const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const movieRouter = require('./routers/movieRouter');

const app = express();
dotenv.config();
const { mongo_uri, secret } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
------------ SESSION SETUP ------------
*/
const sessionStore = MongoStore.create({ mongoUrl: mongo_uri, collectionName: 'user_sessions'});

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}))


/*
------------ PASSPORT AUTHENTICATION ------------
*/
require('./passport');

app.use(passport.initialize());
app.use(passport.session());

app.get('/isAuthenticatedUser', (req, res) => {
  let isValidated = false;
  // if (req.isAuthenticated()) isValidated = true;
  if (req.isAuthenticated()) {
    isValidated = true;
    console.log('CURRENT USER\'S ID: ', req.user._id);
  }
  res.status(200).json({ isValidated });
})

app.get('/signout', (req, res) => {
  let signedOut = false;
  req.logout(); 
  if (req.isAuthenticated() === false) signedOut = true
  res.status(200).json({ signedOut })
})

app.use('/movie', movieRouter);
app.use('/user', userRouter);

// if NODE_ENV is production run this code
if (process.env.NODE_ENV === 'production') {
  // If the endpoint is 'build serve static files from build directory. This endpoint is hit from the script tag on index.html
  app.use('/build', express.static(path.join(__dirname, '../build')));
}

// when a user goes to our url homepage serve html file
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html/'));
});

// handle page refreshes for pages that are not the home page as well as direct manual url requests
app.get('/*', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html/'));
});


app.use((err, req, res, next) => {
  const defaultErr = {
    status: 400,
    message: { err: 'Express error handler caught unknown middleware error' }
  }
  const errorObj = Object.assign(defaultErr, err);
  res.status(errorObj.status).json(errorObj);
})

// server will listen on port '3000'
app.listen(3000);

