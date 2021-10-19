import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/Movies.module.css';
import { AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Preview = ({ preview, content }) => {
  console.log("Inside Preview ", preview);
  console.log('Inside Content ', content);
  // using state to keep track of what movies from preview should be displayed and to ensure next and previous movies functionality correct updates and renders movies
  const [displayed, setDisplayed] = useState([0, 4])
  // array to store all selected movies from preview
  const moviesToPreview = [];
  // variable and swtich statement used to dynamically display the title for preview depending on the desired type of content
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

  // creating each movie to be displayed and adding each to moviesToPreview array
  for (let i = displayed[0]; i <= displayed[1]; i += 1) {
    const movie = preview[i];
    console.log('Movie ',movie);
    moviesToPreview.push(
      <div className={css.moviePreview} key={movie.id}>
        <Link to={`/movie-info/${movie.id}`}>
          <img className={css.previewImage} src={movie.poster_path}/>
        </Link>
        <p className={css.moviePreviewRating}><AiFillStar className={css.starRating} color='pink'/>{movie.vote_average}</p>
        <p className={css.moviePreviewTitle}><Link to={`/movie-info/${movie.id}`}>{movie.original_title}</Link></p>
        <button className={css.previewInfo}><AiOutlineInfoCircle className={css.infoCircle} size='25px' color='white'/></button>
      </div>
    ) 
  }

  // function that is invoked when left or right chevrons buttons are clicked to display the next or previous 4 movies
  function moviesPreviewChange(direction) {
    direction === 'next' ? setDisplayed([displayed[0] + 5, displayed[1] + 5]): setDisplayed([displayed[0] - 5, displayed[1] - 5])
  }

  return (
    <div className={css.outerPreview}>
      <h2>{previewTitle}</h2>
      <div className={css.innerPreview}>
        <button className={css.previous} onClick={() => { if (displayed[0] !== 0) moviesPreviewChange('previous') }}>
          {/* <BsChevronCompactLeft size='40px' color='white'/> */}
          <FaChevronLeft size='40px' color='white'/>
        </button>
        {moviesToPreview}
        <button className={css.next} onClick={ () => { if (displayed[0] !== 10) moviesPreviewChange('next') }}>
          {/* <BsChevronCompactRight size='40px' color='white'/> */}
          <FaChevronRight size='40px' color='white'/>
        </button>
      </div>
    </div>
  )
}

export default Preview;