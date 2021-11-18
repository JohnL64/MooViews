import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/ComingSoon.module.css';
import PageNavigator from '../components/PageNavigator.jsx';

const ComingSoon = ({ imageErrorHandler }) => {
  // Using state to store coming soon movie data retreived from server
  const [comingSoon, setComingSoon] = useState(null);
  const [renderPage, setRenderPage] = useState(false);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(null);
  // Making a request to the server for coming soon movie data after components first render
  useEffect(() => {
    if (!comingSoon) {
      fetch(`/movie/coming-soon?content=comingSoon&page=${page}`)
        .then(res => res.json())
        .then(data => {
          console.log(data.comingSoon);
          setNumOfPages(Math.ceil(data.comingSoon.length / 20));
          setComingSoon(data.comingSoon);
          setRenderPage(true);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      setRenderPage(true);
    }
  }, [page])

  function getMonthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return monthNames[Number(month)];
  }

  function comingSoonMovies() {
    console.log(comingSoon.length, numOfPages)
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

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
          <Link to={`/movie-info/${movie.id}`}><img src={movie.poster_path} /> </Link>
          <div className={css.movieInfo}>
            <p className={css.movieTitle}>{movie.title}</p>
            <p className={css.generalMovieInfo}> 
              <span className={css.genInfo}>{getMonthName(movie.release_date.slice(5, 7) - 1) + ' ' + movie.release_date.slice(8, 10) + ' ' + movie.release_date.slice(0, 4)},</span> 
              <span className={css.genInfo}>{movie.genres}</span>
            </p>
            <p className={css.movieOverview}>{movie.overview}</p>
          </div>
        </div>
      )
    }
    for (const key in datesObj) {
      const date = getMonthName((key.slice(5, 7)) - 1) + ' ' + Number(key.slice(8, 10));
      console.log(date);
      moviesByDates.push(
        <div className={css.CSdate} key={date}>
          <h3 className={css.dateTitle}>{date}</h3>
          {datesObj[key]}
        </div>
      )
    }
    return moviesByDates;
  }

  function renderNewPage(pageNum) {
    setRenderPage(false);
    setPage(pageNum);
  }

  return ( 
  <div className={css.comingSoon}>
    <h2 className={css.CStitle}>Coming Soon</h2>
    { renderPage &&
      <div className={css.innerCS}>
        {comingSoonMovies(comingSoon, page)}
      </div> }
    { renderPage &&
      <div className='pageNavigator'>
        <PageNavigator page={page} numOfPages={numOfPages} renderNewPage={renderNewPage}/>
      </div> }
  </div> );
}
 
export default ComingSoon;