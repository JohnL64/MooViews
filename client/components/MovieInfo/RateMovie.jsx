import React, { useState, useEffect } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const RateMovie = ({ userRating, setUserRating, setShowRateMovie, movieInfo, setMovieInfo }) => {
  document.body.style.overflow = 'hidden';

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (userRating) {
      setRating(userRating);
      setHover(userRating);
    }
    return function enableScrolling() {
      document.body.style.overflow = 'auto';
    }
  }, [])


  function updateMovieRating(newDbRating, reviewedUserIsCurrentUser) {
    const newMovieInfo = { ...movieInfo };
    if (typeof movieInfo.vote_count !== 'string') {
      newMovieInfo.vote_average = newDbRating.rating;
      newMovieInfo.vote_count = newDbRating.vote_count;
    }
    const previousDbRating = newMovieInfo.dbRating;
    newMovieInfo.dbRating = newDbRating;
    const dbRating = newMovieInfo.dbRating;
    if (previousDbRating.review) {
      dbRating.username = previousDbRating.username;
      dbRating.date = previousDbRating.date;
      dbRating.review = previousDbRating.review;
      dbRating.headline = previousDbRating.headline;
      if (!reviewedUserIsCurrentUser) dbRating.user_rating  = previousDbRating.user_rating;
      else dbRating.user_rating = rating;
    } else dbRating.review = null;
    setMovieInfo(newMovieInfo);
    setUserRating(rating);
  }

  async function inputUserRating() {
    const { dbRating, id, tmdb_vote_count, vote_average } = movieInfo;
    setShowRateMovie(false);
    let previousUserRating = userRating;
    let reviewedUserIsCurrentUser;
    setUserRating(null);

    if (!previousUserRating) {
      await fetch('/movie/user-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id, rating })
      })
        .catch(err => {
          console.log(err);
        })
    } else {
      await fetch('/movie/user-rating', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id, rating, dbRating })
      })
        .then(res => res.json())
        .then(data => {
          reviewedUserIsCurrentUser = data.reviewedUserIsCurrentUser;
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (!dbRating)  {
      fetch('/movie/movie-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id, rating, tmdb_vote_count, vote_average })
      })
        .then(res => res.json())
        .then(data => {
          updateMovieRating(data.addedDbRating);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      fetch('/movie/movie-info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { dbRating, id, rating, previousUserRating })
      })
        .then(res => res.json())
        .then(data => {
          updateMovieRating(data.updatedDbRating, reviewedUserIsCurrentUser);
        })
        .catch(err => {
          console.log(err.message);
        })
    }
  }

  function createStars() {
    const starsArr = [];
    for (let i = 1; i <= 10; i += 1) {
      if (i <= hover) starsArr.push(<AiFillStar className={css.rateMovieStar} onClick={() => setRating(i)} key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(rating)}/>);
      else starsArr.push(<AiOutlineStar className={css.rateMovieStar} onClick={() => setRating(i)} key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(rating)}/>);
    }
    return starsArr;
  }

  return ( 
    <div className={css.rateMovie} onClick={() => setShowRateMovie(false)}>
      <div className={css.ratingBox} onClick={e => e.stopPropagation()}>
        <IoClose className={css.closeRating} onClick={() => setShowRateMovie(false)}/>
        <div className={css.selectedRating}>
          <AiFillStar className={css.ratingMainStar}/>
          <p>{ rating ? rating : '?'}</p>
        </div>
        <p className={css.rateThis}>Rate This</p>
        <p className={css.ratingMovieTitle}>{movieInfo.title}</p>
        <div className={css.ratingStars}>
          {createStars()}
        </div>
        <button className={css.submitRating} disabled={!rating || (userRating && rating === userRating)} onClick={() => inputUserRating()}>Rate</button>
      </div>
    </div>
   );
}
 
export default RateMovie;