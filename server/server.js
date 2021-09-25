const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const movieRouter = require('./routers/movieRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

