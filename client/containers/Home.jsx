import React, { useState, useEffect } from 'react';
import css from '../styles/Home.module.css';
import Preview from '../components/Preview.jsx';
// import Popular from '../components/Popular.jsx';

const Home = ({ content }) => {
  // setting state for list of movies now playing and popular
  const [preview, setPreview] = useState(null);
  const [main, setMain] = useState(null);

  // making a request to server to fetch now playing and popular movies from movie api after component is rendered for the first time
  useEffect(() => {
    if (!content) content = 'home';
    console.log(content)
    console.log(typeof content)
    // fetch(`/movie/search?keyword=${e.target.value}`)
    fetch(`/movie/content?content=${content}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  })

  return (
    <div className={css.homePage}>
      <h1>Home Page</h1>
      <Preview />
      {/* <Popular /> */}
    </div>
  )
}

export default Home;