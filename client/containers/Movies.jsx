import React, { useState, useEffect } from 'react';
import css from '../styles/Movies.module.css';
import Preview from '../components/Movies/Preview.jsx';
// import Popular from '../components/Popular.jsx';

const Movies = ({ content }) => {
  // setting state for list of movies now playing and popular
  const [preview, setPreview] = useState(null);
  const [main, setMain] = useState(null);
  if (!content) content = 'home';
  // making a request to server to fetch now playing and popular movies from movie api after component is rendered for the first time
  useEffect(() => {
    fetch(`/movie/content?content=${content}`)
      .then(res => res.json())
      .then(data => {
        setPreview(data.preview);
      })
  }, [])

  return (
    <div className={css.movies}>
      {/*Once data is fetched and preview is updated Preview component will be rendered */}
      {preview && <Preview preview={preview} content={content} />}
      {/* <Popular /> */}
    </div>
  )
}

export default Movies;