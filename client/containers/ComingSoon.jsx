import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import css from '../styles/ComingSoon.module.css';
import PageNavigator from '../components/PageNavigator.jsx';
import ExpandInfo from '../components/ExpandInfo.jsx';
import { GiFilmProjector } from 'react-icons/gi';


const ComingSoon = ({ imageErrorHandler }) => {
  document.body.style.backgroundColor = 'white';
  document.title = 'Coming Soon - MooViews';
  window.scrollTo(0, 0);
  const page = Number(useParams().page);
  // Using state to store coming soon movie data retreived from server
  const [comingSoon, setComingSoon] = useState(null);
  const [numOfPages, setNumOfPages] = useState(null);
  const [CSimageErrors, setCSimageErrors] = useState({});
  // Making a request to the server for coming soon movie data after components first render
  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/movie/coming-soon?content=comingSoon`, { signal: abortCont.signal })
      .then(res => res.json())
      .then(data => {
        setNumOfPages(Math.ceil(data.comingSoon.length / 20));
        setComingSoon(data.comingSoon);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch Aborted');
        }
        // console.log(err);
      })

    return () => abortCont.abort();
  }, [])

  function getMonthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return monthNames[Number(month)];
  }

  function comingSoonMovies() {
    const moviesByDates = [];
    const datesObj = {};
    let firstMovie = (page - 1) * 20;
    let lastMovie = (page * 20) - 1;
    if (page === numOfPages) {
      let moviesOnLastPage = comingSoon.length % 20;
      if (moviesOnLastPage) lastMovie = firstMovie + (moviesOnLastPage - 1);
    }

    for (let i = firstMovie; i <= lastMovie; i += 1) {
      const movie = comingSoon[i];
      if (!datesObj.hasOwnProperty(movie.release_date)) datesObj[movie.release_date] = [];
      datesObj[movie.release_date].push(
        <div className={css.CSmovie} key={movie.id}>
          {(movie.poster_path && !CSimageErrors[movie.id]) &&
            <Link to={`/movie/${movie.id}`} className={css.imageLink}>
              <img src={movie.poster_path} className={css.CSimage} onError={(e) => imageErrorHandler(e, movie.id, CSimageErrors, setCSimageErrors)}/> 
            </Link> }
          {(!movie.poster_path || CSimageErrors[movie.id]) && 
            <div className={css.CSimageUnavailable}>
              <GiFilmProjector className={css.movieIcon} />
            </div> }
          <div className={css.movieInfo}>
            <Link to={`/movie/${movie.id}`} className={css.titleLink}>
              <p className={css.movieTitle}>{movie.title}</p>
            </Link>
            <p className={css.generalMovieInfo}> 
              <span className={css.genInfo}>{getMonthName(movie.release_date.slice(5, 7) - 1) + ' ' + Number(movie.release_date.slice(8, 10)) + ', ' + movie.release_date.slice(0, 4)}</span> 
              { movie.genres && <span>|</span> }
              <span>{movie.genres}</span>
            </p>
            <p className={css.movieOverview}>{movie.overview}</p>
            <ExpandInfo id={movie.id} />
          </div>
        </div>
      )
    }
    for (const key in datesObj) {
      const date = getMonthName((key.slice(5, 7)) - 1) + ' ' + Number(key.slice(8, 10));
      moviesByDates.push(
        <div className={css.moviesByDay} key={date}>
          <div className={css.outerDayTitle}>
            <h3 className={css.dayTitle}>{date}</h3>
          </div>
          {datesObj[key]}
        </div>
      )
    }
    return moviesByDates;
  }

  function createCSloadingBox() {
    return (
      <div className={css.innerCS}>
        <div className={css.loadingDayTitle}></div>
          <div className={css.CSloadingBox}>
            <div className="loadingDots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
      </div>
    )
  }

  return ( 
    <div className={css.comingSoon}>
      <div className={css.CStitle}>
        <h3 className={css.innerTitle}>Coming Soon</h3>
      </div>
      { comingSoon &&
        <div className={css.innerCS}>
          {comingSoonMovies(comingSoon, page)}
          <PageNavigator page={page} numOfPages={numOfPages} content='coming-soon'/>
        </div> }
        { !comingSoon && createCSloadingBox() }
    </div> 
  );
}
 
export default ComingSoon;