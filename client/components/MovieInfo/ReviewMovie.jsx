import React, { useState, useEffect} from 'react';
import css from '../../styles/MovieInfo.module.css';
import { IoClose } from 'react-icons/io5';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const ReviewMovie = ({ setReviewMovie, posterPath, title, year, userRating}) => {
  document.body.style.overflow = 'hidden';

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [headline, setHeadline] = useState('');

  useEffect(() => {
    if (userRating) {
      setRating(userRating);
      setHover(userRating);
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
    <div className={css.outerReviewMovie} onClick={() => setReviewMovie(false)}>
      <div className={css.reviewMovie} onClick={e => e.stopPropagation()}>
        <div className={css.closeBar}><IoClose className={css.closeReview} onClick={() => setReviewMovie(false)}/></div>
        <div className={css.reviewingMovieInfo}>
          <img src={posterPath} />
          <p>{title} {year}</p>
          {/* {<p>Add item</p> */}
        </div>
        <div className={css.reviewRating}>
          <p>YOUR RATING</p>
          <div>{createStars()}</div>
        </div>
        <form className={css.headlineAndReview}>
          <p>YOUR REVIEW</p>
          {/* <input type='text' id="username" required value={username} placeholder='Username' onChange={(e) => setUsername(e.target.value)} /> */}
          <input type="text" required value={headline} placeholder="Write a headline for your review here" onChange={(e) => setHeadline(e.target.value)} />
          <textarea cols="30" rows="10" placeholder="Write your review here"></textarea>
          <button>Submit Review</button>
        </form>
      </div>
    </div>
   );
}
 
export default ReviewMovie;