import React, { useState, useEffect} from 'react';
import css from '../../styles/MovieInfo.module.css';
import { IoClose, IoAlertCircleSharp } from 'react-icons/io5';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const ReviewMovie = ({ setReviewMovie, posterPath, title, year, userRating, updateOrAddReviewAndMovie}) => {
  document.body.style.overflow = 'hidden';

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [mainAlert, setMainAlert] = useState(false);
  const [ratingAlert, setRatingAlert] = useState(false);
  const [headlineAlert, setHeadlineAlert] = useState(false);
  const [reviewAlert, setReviewAlert] = useState(false);

  useEffect(() => {
    if (userRating) {
      setRating(userRating.user_rating);
      setHover(userRating.user_rating);
      if (userRating.review) {
        setHeadline(userRating.headline);
        setReview(userRating.review);
      }
    }
    return function enableScrolling() {
      document.body.style.overflow = 'auto';
    }
  }, [])

  function createStars() {
    function starsAndClearAlerts(number) {
      setRating(number);
      setRatingAlert(false);
    }
    const starsArr = [];
    for (let i = 1; i <= 10; i += 1) {
      if (i <= hover) starsArr.push(<AiFillStar className={css.reviewMovieStar} onClick={() => starsAndClearAlerts(i)} key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(rating)}/>);
      else starsArr.push(<AiOutlineStar className={css.reviewMovieStarOut} onClick={() => starsAndClearAlerts(i)} key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(rating)}/>);
    }
    return (
      <div className={css.starsBox}>
        {starsArr}
        <span>{hover}</span>
      </div>
    )
  }

  function updateFieldsAndClearAlerts(e, field) {
    let userInput = e.target.value;
    if (field === 'headline') {
      // As long as input field is not empty alert will be cleared.
      if (userInput.length > 0) setHeadlineAlert(false);
      // If user is editing a review and current headline is different from the headline saved in database remove mainAlert from the page.
      if ((userRating && userRating.headline) && userInput !== userRating.headline) setMainAlert(false);
      setHeadline(userInput)
    } else {
      if (userInput.length > 0 && reviewAlert === true) setReviewAlert(false);
      else if (userInput.length >= 150 && reviewAlert === 'not150') setReviewAlert(false);
      if ((userRating && userRating.review) && userInput !== userRating.review) setMainAlert(false);
      setReview(userInput);
    }
  }

  function conditionalAddOrUpdate (e) {
    e.preventDefault();
    if (userRating) {
      if (rating !== userRating.user_rating || (review !== userRating.review && review.length >= 150) || (headline !== userRating.headline && headline)) {
        console.log('UPDATING! review and movie ALL REQUIREMENTS MET');
        // updateOrAddReviewAndMovie(setReviewMovie, rating, review, headline);
      } else if (rating === userRating.user_rating && (review === userRating.review && headline === userRating.headline)) setMainAlert(true);
    } else if ((!userRating && rating) && (headline && review.length >= 150)) {
      console.log('ADDING! review and adding or updating movie ALL REQUIREMENTS MET')
      // updateOrAddReviewAndMovie(setReviewMovie, rating, review, headline);
    }

    if (!rating) setRatingAlert(true);
    if (!headline) setHeadlineAlert(true);
    if (!review) setReviewAlert(true);
    else if (review.length < 150) setReviewAlert('not150');
  }

  return ( 
    <div className={css.outerReviewMovie} onClick={() => setReviewMovie(false)}>
      <div className={css.reviewMovie} onClick={e => e.stopPropagation()}>
        <div className={css.closeBar}><IoClose className={css.closeReview} onClick={() => setReviewMovie(false)}/></div>
        <div className={css.reviewingMovieInfo}>
          <img src={posterPath} />
          <div className={css.infoAndAction}>
            <p className={css.titleAndYear}>{title} <span>({year})</span></p>
            { (userRating && !userRating.review) ? <p className={css.action}>Add item</p> : <p className={css.action}>Edit Item</p>}
          </div>
        </div>
        <div className={css.reviewRating}>
          <p>YOUR RATING</p>
          {createStars()}
          { ratingAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> Rating is required to add review.</div>}
        </div>
        <form className={css.headlineAndReview} onSubmit={conditionalAddOrUpdate}>
          <p>YOUR REVIEW</p>
          <input type="text" value={headline} placeholder="Write a headline for your review here" onChange={(e) => updateFieldsAndClearAlerts(e, 'headline')} />
          { headlineAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> A required field is missing.</div>}
          <textarea value={review} placeholder="Write your review here" onChange={(e) => updateFieldsAndClearAlerts(e, 'review')}></textarea>
          { reviewAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> {reviewAlert === 'not150' ? 'Sorry, your review is too short. It needs to contain at least 150 characters.' : 'A required field is missing.'}</div>}
          { mainAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> There are no changes your review to update.</div>}
          <button>Submit</button>
        </form>
      </div>
    </div>
   );
}
 
export default ReviewMovie;