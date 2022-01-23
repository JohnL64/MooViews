import React, { useState, useEffect } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { IoClose, IoConstructOutline } from 'react-icons/io5';

const RateMovie = ({ userRating, setShowRateMovie, movieInfo, updateOrAddReviewAndMovie }) => {
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
        <button className={css.submitRating} disabled={!rating || (userRating && rating === userRating.user_rating)} onClick={() => updateOrAddReviewAndMovie(setShowRateMovie, rating)}>Rate</button>
      </div>
    </div>
   );
}
 
export default RateMovie;