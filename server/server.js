const express = require('express');
const app = express();
const path = require('path');
const { send } = require('process');
const db = require('./model.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if NODE_ENV is production run this code
if (process.env.NODE_ENV === 'production') {
  // If the endpoint is 'build serve static files from build directory. This endpoint is hit from the script tag on index.html
  app.use('/build', express.static(path.join(__dirname, '../build')));
}

// when a user goes to our url homepage serve html file
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html/'));
});

// server will listen on port '3000'
app.listen(3000);


