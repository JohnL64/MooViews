import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/ComingSoon.module.css';

const ComingSoon = ({ imageErrorHandler, createPageNavigator }) => {
  // Using state to store coming soon movie data retreived from server
  const [comingSoon, setComingSoon] = useState(null);
  const [allPages, setAllPages] = useState(null);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(null);
  const [dates, setDates] = useState(null);
  // Making a request to the server for coming soon movie data after components first render
  useEffect(() => {
    if (!allPages) {
    fetch(`/movie/main?content=comingSoon&page=${page}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let currPageMovies = data.main.slice(0, 20);
        setNumOfPages(Math.ceil(data.main.length / 20));
        setDates(data.dates);
        setComingSoon(currPageMovies);
        setAllPages(data.main);
      })
      .catch(err => {
        console.log(err);
      })
    } 
    else {
      let firstMovie = (page - 1) * 20;
      let lastMovie = (page * 20) - 1;
      if (page === numOfPages) {
        let lastPageMovies = allPages.length % 20;
        if (lastPageMovies) lastMovie = firstMovie + (lastPageMovies - 1);
      }
      if (allPages[lastMovie].hasOwnProperty('genres')) {
        let selectedMovies = [];
        const datesObj = {};
        for (let i = firstMovie; i <= lastMovie; i += 1) {
          let movie = allPages[i];
          if (!datesObj.hasOwnProperty(movie.release_date)) datesObj[movie.release_date] = true;
          selectedMovies.push(movie);
        }
        setDates(datesObj);
        setComingSoon(selectedMovies);
      } else {
        fetch(`/movie/changeCSpage?content=comingSoon&page=${page}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({allPages: allPages, firstMovie: firstMovie, lastMovie: lastMovie })
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          let reqComingSoon = data.updatedReqPage.slice(firstMovie, lastMovie + 1);
          setDates(data.dates);
          setComingSoon(reqComingSoon);
          setAllPages(data.updatedReqPage);
        })
        .catch(err => {
          console.log(err);
        })
      }
    }
  }, [page])

  function comingSoonMovies(comingSoon, datesObj) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November ", "December"];
    const moviesByDates = [];
    for (const key in datesObj) {
      datesObj[key] = [];
    }
    for (const movie of comingSoon) {
      datesObj[movie.release_date].push(
        <div className={css.CSmovie} key={movie.id}>
          <Link to={`/movie-info/${movie.id}`}><img src={movie.poster_path} /> </Link>
          <div className={css.movieInfo}>
            <p className={css.movieTitle}>{movie.title}</p>
            <p className={css.generalMovieInfo}> 
              <span className={css.genInfo}>{movie.MPAA_rating},</span> 
              <span className={css.genInfo}>{movie.runtime},</span> 
              <span className={css.genInfo}>{movie.release_date},</span> 
              <span className={css.genInfo}>{movie.genres}</span>
            </p>
            <p className={css.movieOverview}>{movie.overview}</p>
          </div>
        </div>
      )
    }
    for (const key in datesObj) {
      const date = monthNames[(Number(key.slice(5, 7)) - 1)] + Number(key.slice(8, 10));
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
    setComingSoon(null);
    setPage(pageNum);
  }

  return ( 
  <div className={css.comingSoon}>
    <h2 className={css.CStitle}>Coming Soon</h2>
    { comingSoon &&
      <div className={css.innerCS}>
        {comingSoonMovies(comingSoon, {...dates})}
      </div> }
    { comingSoon &&
      <div className='pageNavigator'>
        {createPageNavigator(page, numOfPages, renderNewPage)}
      </div> }
  </div> );
}
 
export default ComingSoon;