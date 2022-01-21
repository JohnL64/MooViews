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
      setRating(userRating.user_rating);
      setHover(userRating.user_rating);
    }
    return function enableScrolling() {
      document.body.style.overflow = 'auto';
    }
  }, [])


  function updateMovieRating(newDbRating, newUserRating, reviewedUserIsCurrentUser) {
    const newMovieInfo = { ...movieInfo };
    // Only updates vote count and average rating only if the current vote count is less than 1000 because if the vote count is less than a thousand 
    if (typeof movieInfo.vote_count !== 'string') {
      newMovieInfo.vote_average = newDbRating.rating;
      if (newDbRating.vote_count === 1000) newMovieInfo.vote_count = '1K';
      else newMovieInfo.vote_count = newDbRating.vote_count;
    }
    // Updating dbRating in movieInfo to inculde the new or updated changes to current movie and to ensure the data on the client side matches with the database.
    newMovieInfo.dbRating = newDbRating;

    // If the current user that updated their movie rating is also the user with the most recent written review, the rating must be updated in the new latestReview object to ensure the UserReviews section displays the correct data.
    if (reviewedUserIsCurrentUser) {
      const newLatestReview = { ...movieInfo.latestReview } 
      newLatestReview.user_rating = rating;
      newMovieInfo.latestReview = newLatestReview;
    }
    setMovieInfo(newMovieInfo);

    // Updates the user's rating in userRating to display the newly added 
    setUserRating(newUserRating);
  }

  async function inputUserRating() {
    const { dbRating, latestReview, id, tmdb_vote_count, vote_average } = movieInfo;
    setShowRateMovie(false);
    let previousUserRating = userRating.user_rating;
    let newUserRating;
    let reviewedUserIsCurrentUser;
    // Setting userRating to null so that the loading circle and 'Rate' text are shown when adding/updating rating or movie to database.
    setUserRating(null);

    if (!previousUserRating) {
      await fetch('/movie/user-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id, rating })
      })
        .then(res => res.json())
        .then(data => {
          newUserRating = data.userRating;
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      await fetch('/movie/user-rating', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id, rating, latestReview })
      })
        .then(res => res.json())
        .then(data => {
          newUserRating = data.userRating;
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
          updateMovieRating(data.addedDbRating, newUserRating);
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
          updateMovieRating(data.updatedDbRating, newUserRating, reviewedUserIsCurrentUser);
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
        <button className={css.submitRating} disabled={!rating || (userRating && rating === userRating.user_rating)} onClick={() => inputUserRating()}>Rate</button>
      </div>
    </div>
   );
}
 
export default RateMovie;