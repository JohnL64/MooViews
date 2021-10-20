import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MoviePreviewInfo from './MoviePreviewInfo.jsx';
import css from '../../styles/Movies.module.css';
import { AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Preview = ({ preview, content }) => {
  // using state to keep track of what movies from preview should be displayed and to ensure next and previous movies functionality correctly updates and renders movies
  const [displayed, setDisplayed] = useState([0, 4])
  // using state to determine whether MoviePreviewInfo should be rendered. If info button is clicked this state would be updated to the necessary data for selected movie and to be passed down to MoviePreviewInfo component.
  const [movieToShowInfo, setMovieToShowInfo] = useState(null);

  // array to store all invidual movie preview elements to be rendered
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

  // creates an object that will store all necessary data for the selected movie and will be passed down into MoviePreviewInfo
  function movieDataForInfo(backdrop, releaseDate, id, title, overview) {
    const movieData = {
      backdrop,
      releaseDate,
      id,
      title,
      overview
    }
    setMovieToShowInfo(movieData);
  }

  // buidling out each individual movie to be rendered in Preview
  for (let i = displayed[0]; i <= displayed[1]; i += 1) {
    const movie = preview[i];
    moviesToPreview.push(
      <div className={css.moviePreview} key={movie.id}>
        <Link to={`/movie-info/${movie.id}`}>
          <img className={css.previewImage} src={movie.poster_path}/>
        </Link>
        <p className={css.moviePreviewRating}><AiFillStar className={css.starRating} color='pink'/>{movie.vote_average}</p>
        <p className={css.moviePreviewTitle}><Link to={`/movie-info/${movie.id}`}>{movie.title}</Link></p>
        <button className={css.previewInfo} onClick={() => { movieDataForInfo(movie.backdrop_path, movie.release_date, movie.id, movie.title, movie.overview)}}><AiOutlineInfoCircle className={css.infoCircle} size='25px' color='white'/></button>
      </div>
    ) 
  }

  // function that is invoked when left or right chevrons buttons are clicked to display the next or previous list of movies
  function moviesPreviewChange(direction) {
    direction === 'next' ? setDisplayed([displayed[0] + 5, displayed[1] + 5]): setDisplayed([displayed[0] - 5, displayed[1] - 5])
  }

  return (
    <div className={css.outerPreview}>
      <h2>{previewTitle}</h2>
      <div className={css.innerPreview}>

        { displayed[0] !== 0 && 
          <button className={css.previous} onClick={() => { if (displayed[0] !== 0) moviesPreviewChange('previous') }}>
            <FaChevronLeft size='40px' color='white'/>
          </button> }

        {moviesToPreview}

        { displayed[0] !== 15 && 
          <button className={css.next} onClick={ () => { if (displayed[0] !== 15) moviesPreviewChange('next') }}>
            <FaChevronRight size='40px' color='white'/>
          </button> }

      </div>
      { movieToShowInfo && <MoviePreviewInfo backdrop={movieToShowInfo.backdrop} releaseDate={movieToShowInfo.releaseDate} id={movieToShowInfo.id} title={movieToShowInfo.title} overview={movieToShowInfo.overview}  />}
    </div>
  )
}

export default Preview;