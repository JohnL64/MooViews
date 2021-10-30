import React from 'react';
import css from '../../styles/Main.module.css';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

const Main = ({ main, content, setPage }) => {
  const mainContent = [];

  function mainMovie(movie) {
    return (
      <div className={css.mainMovie} key={movie.id}>
        <Link to={`/movie-info/${movie.id}`}> <img className={css.mainImage} src={movie.poster_path}/> </Link>
        <div className={css.mainMovieInfo}>
          <p className={css.mainMovieTitle}><Link className={css.mainTitleLink} to={`/movie-info/${movie.id}`}>{movie.title} </Link></p>
          <p className={css.allGeneralMovieInfo}> 
            <span className={css.genInfo}>{movie.MPAA_rating},</span> 
            <span className={css.genInfo}>{movie.runtime},</span> 
            <span className={css.genInfo}>{movie.release_date},</span> 
            <span className={css.genInfo}>{movie.genres}</span>
          </p>
          <p className={css.movieMainRating}><AiFillStar className={css.starRating} color='pink'/>{movie.vote_average}</p>
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

  // using variable and switch statement to dynamically render title for main content
  let mainTitle;
  switch(content) {
    case 'home': 
      mainTitle = 'Most Popular';
      break;
    case 'topRated': 
      mainTitle = 'Top Rated';
      break;
    case 'upcoming': 
      mainTitle = 'Coming Soon';
      break;
  }
  return ( 
    <div className={css.outerMain}>
      {!main && 
        <div className={css.loadingDots}>
          <div></div>
          <div></div>
          <div></div>
        </div> }
      { main && <h2>{mainTitle}</h2> }
      { main && 
        <div className={css.innerMain}>
          {mainContent}
        </div> }
    </div>
   );
}
 
export default Main;