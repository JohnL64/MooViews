import React, { useState, useEffect } from 'react';
import css from '../styles/Home.module.css';
// const dotenv = require('dotenv');

// dotenv.config();
// const { api_key  } = process.env;

const Home = (props) => {
  // setting state for list of movies now playing and popular
  const [nowPlaying, setNowPlaying] = useState(null);
  const [popular, setPopular] = useState(null);

  // console.log(process.env.REACT_APP_api_key);
  return (
    <div className={css.homePage}>
      <h1>Your Movie List</h1>
    </div>
  )
}

export default Home;