import React, { useState, useEffect } from 'react';
import css from '../styles/Home.module.css';


const Home = (props) => {
  // setting state for list of movies now playing and popular
  const [nowPlaying, setNowPlaying] = useState(null);
  const [popular, setPopular] = useState(null);

  return (
    <div className={css.homePage}>
      <h1>Your Movie List</h1>
    </div>
  )
}

export default Home;