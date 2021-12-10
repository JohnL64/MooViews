import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MoviePreviewInfo from './MoviePreviewInfo.jsx';
import css from '../../styles/Preview.module.css';
import { AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiFilmProjector } from 'react-icons/gi';

const Preview = ({ preview, imageErrorHandler }) => {
  // using state to keep track of what movies from preview should be displayed and to ensure next and previous movies functionality correctly updates and renders movies
  const [displayed, setDisplayed] = useState([0, 5])
  // using state to determine whether MoviePreviewInfo should be rendered. If info button is clicked this state would be updated to the necessary data for selected movie and to be passed down to MoviePreviewInfo component.
  const [movieToShowInfo, setMovieToShowInfo] = useState(null);
  // using state to render a message when an error occurs trying to display an image for a movie. 
  const[previewImageErrors, setPreviewImageErrors ] = useState({})

  // array to store all invidual movie preview elements to be rendered
  const moviesToPreview = [];


  // creates an object that will store all necessary data for the selected movie and will be passed down into MoviePreviewInfo
  function movieDataForInfo(backdrop, releaseDate, id, title, overview, genres) {
    const movieData = {
      backdrop,
      releaseDate,
      id,
      title,
      overview,
      genres
    }
    setMovieToShowInfo(movieData);
  }

  for (let i = displayed[0]; i <= displayed[1]; i += 1) {
    const movie = preview[i];
    moviesToPreview.push(
      <div className={css.moviePreview} key={movie.id}>
        { !previewImageErrors[movie.id] && 
          <Link to={`/movie/${movie.id}`}>
            <img className={css.previewImage} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, previewImageErrors, setPreviewImageErrors)}/>
          </Link> }
        { previewImageErrors[movie.id] && <div className={css.previewImageUnavailable}><GiFilmProjector className={css.filmIcon} /></div>}
        <p className={css.moviePreviewRating}><AiFillStar className={css.starRating} />{movie.vote_average}</p>
        <p className={css.moviePreviewTitle}><Link to={`/movie/${movie.id}`}>{movie.title}</Link></p>
        <button className={css.previewInfoBtn} onClick={() => { movieDataForInfo(movie.backdrop_path, movie.release_date, movie.id, movie.title, movie.overview, movie.genres)}}><AiOutlineInfoCircle className={css.infoBtnIcon} color='white'/></button>
      </div>
    ) 
  }

  // function that is invoked when left or right chevrons buttons are clicked to display the next or previous list of movies
  function moviesPreviewChange(direction) {
    direction === 'next' ? setDisplayed([displayed[0] + 6, displayed[1] + 6]): setDisplayed([displayed[0] - 6, displayed[1] - 6])
  }

  // disables scrolling when modal is open 
  movieToShowInfo ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

  return (
    <div className={css.outerPreview}>
      <h2>In Theaters</h2>
      <div className={css.innerPreview}>
        { displayed[0] !== 0 && 
          <button className={css.previous} onClick={() => { if (displayed[0] !== 0) moviesPreviewChange('previous') }}>
            <FaChevronLeft className={css.previousIcon} color='white'/>
          </button> }

        {moviesToPreview}

        { displayed[0] !== 30 && 
          <button className={css.next} onClick={ () => { if (displayed[0] !== 30) moviesPreviewChange('next') }}>
            <FaChevronRight className={css.nextIcon} color='white'/>
          </button> }

      </div>
      { movieToShowInfo && <MoviePreviewInfo close={setMovieToShowInfo} movieToShowInfo={movieToShowInfo}  imageErrorHandler={imageErrorHandler}/>}
    </div>
  )
}

export default Preview;