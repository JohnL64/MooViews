import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/ComingSoon.module.css';

const ComingSoon = () => {
  // Using state to store coming soon movie data retreived from server
  const [comingSoon, setComingSoon] = useState(null);
  const [allPages, setAllPages] = useState(null);
  const [page, setPage] = useState(1);
  let numOfPages;
  // Making a request to the server for coming soon movie data after components first render
  useEffect(() => {
    if (!allPages) {
    fetch(`/movie/main?content=comingSoon&page=${page}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let currPageMovies = data.main.slice(0, 20);
        setComingSoon(currPageMovies)
        setAllPages(data.main);
        numOfPages = Math.ceil(data.main.length / 20)
      })
      .catch(err => {
        console.log(err);
      })
    } 
    // else {
    //   if (page)
    //   fetch(`/movie/main?content=comingSoon&page=${page}`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify( { email, username, password })
    //   })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //     // setComingSoon(data.main)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    // }
  }, [])

  function comingSoonMovies(comingSoon) {
    const movies = [];
    for (const movie of comingSoon) {
      movies.push(
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
    return movies;
  }


  return ( 
  <div className={css.comingSoon}>
    <h2 className={css.CStitle}>Coming Soon</h2>
    {comingSoon &&
      <div className={css.innerCS}>
        {comingSoonMovies(comingSoon)}
      </div> }
  </div> );
}
 
export default ComingSoon;