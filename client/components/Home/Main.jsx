import React, { useState } from 'react';
import css from '../../styles/Main.module.css';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import PageNavigator from '../PageNavigator.jsx';

const Main = ({ main, setMain, setPreview, page, setPage, imageErrorHandler, createPageNavigator }) => {
  // using state to render a message when an error occurs trying to display an image for a movie. 
  const [mainImageErrors, setMainImageErrors] = useState({});
  const mainContent = [];
  // creating movie to be displayed 
  function mainMovie(movie) {
    return (
      <div className={css.mainMovie} key={movie.id}>
        { !mainImageErrors[movie.id] && <Link to={`/movie-info/${movie.id}`}> <img className={css.mainImage} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, mainImageErrors, setMainImageErrors)}/> </Link>}
        { mainImageErrors[movie.id] && <div className={css.mainImageUnavailable}><p>Image is currently unavailable</p></div>}
        {/* <Link to={`/movie-info/${movie.id}`}> <img className={css.mainImage} src={movie.poster_path}/> </Link> */}
        <div className={css.mainMovieInfo}>
          <p className={css.mainMovieTitle}><Link className={css.mainTitleLink} to={`/movie-info/${movie.id}`}>{movie.title} </Link></p>
          <p className={css.allGeneralMovieInfo}> 
            <span className={css.genInfo}>{movie.release_date},</span> 
            <span className={css.genInfo}>{movie.genres}</span>
          </p>
          <p className={css.mainMovieRating}><AiFillStar className={css.starRating} />{movie.vote_average}</p>
          <p className={css.mainOverview}>{movie.overview}</p>
          <p className={css.fullDetails}><Link className={css.fullDetailsLink} to={`/movie-info/${movie.id}`}>See full details</Link></p>
        </div>
      </div>
    )
  }

  // creating rows of movies to be rendered for Main. Each row includes two movies
  if (main) {
    for (let i = 0; i < main.length; i += 2) {
      let row = [];
      row.push(mainMovie(main[i]));
      row.push(mainMovie(main[i + 1]));
      mainContent.push(
        <div className={css.mainMovieRow} key={i}>
          {row}
        </div>
      );
    }
  }

  //creates an empty movie box to be displayed when main content is being fetched from server
  function loadingMainMovieBox () {
    return (
      <div className={css.loadingMainMovieBox}>
        <div className="loadingDots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  // changes state for preview, main, and page when a number is clicked in page navigator
  function renderNewPage(pageNum) {
    setPreview(null)
    setMain(null);
    setPage(pageNum);
  }


  return (
    <div className={css.outerMain}>
      <h2>Most Popular</h2>
      <div className={css.innerMain}>
        {!main && 
          <div className={css.loadingMainMovieRow}>
            {loadingMainMovieBox()}
            {loadingMainMovieBox()}
          </div> }
        { main && mainContent }
      </div>
      {main && <PageNavigator page={page} numOfPages={30} renderNewPage={renderNewPage} content='Home'/>}
    </div>
   );
}
 
export default Main;