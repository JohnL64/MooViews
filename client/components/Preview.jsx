import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/Movies.module.css';
import { AiFillStar } from 'react-icons/ai';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';

const Preview = ({ preview, content }) => {
  console.log("Inside Preview ", preview);
  console.log('Inside Content ', content);
  const [displayed, setDisplayed] = useState([0, 3])
  const moviesToPreview = [];
  let previewTitle;

  switch(content) {
    case 'home': 
      previewTitle = 'Now Playing';
      break;
    case 'topRated': 
      previewTitle = 'Most Popular';
      break;
    case 'upcoming': 
      previewTitle = 'Latest';
      break;
  }

  for (let i = displayed[0]; i <= displayed[1]; i += 1) {
    const movie = preview[i];
    console.log('Movie ',movie);
    moviesToPreview.push(
      <div className={css.moviePreview} key={movie.id}>
        <Link to={`/movie-info/${movie.id}`}>
          <img src={movie.poster_path}/>
          <p><AiFillStar color='pink'/>{movie.vote_average}</p>
          <p>{movie.original_title}</p>
        </Link>
      </div>
    ) 
  }
  return (
    <div className={css.preview}>
      <h2>{previewTitle}</h2>
      <button><BsChevronCompactLeft size="50px"/></button>
      {moviesToPreview}
      <button><BsChevronCompactRight /></button>
    </div>
  )
}

export default Preview;