import React, { useState, useEffect} from 'react';
import css from '../../styles/MovieInfo.module.css';
import { IoClose, IoAlertCircleSharp } from 'react-icons/io5';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const ReviewMovie = ({ setReviewMovie, setUserReviews, posterPath, title, year, userRating, updateOrAddReviewAndMovie}) => {
  document.body.style.overflow = 'hidden';

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [headline, setHeadline] = useState('');
  const [review, setReview] = useState('');
  const [mainAlert, setMainAlert] = useState(false);
  const [ratingAlert, setRatingAlert] = useState(false);
  const [headlineAlert, setHeadlineAlert] = useState(false);
  const [headlineLimit, setHeadlineLimit] = useState(false);
  const [reviewAlert, setReviewAlert] = useState(false);
  const [reviewLimit, setReviewLimit] = useState(false);
  const [showQueryingDb, setShowQueryingDb] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);

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
      // If the length of userInput is less than maximum number, update headline and ensure that the limit alert is not displayed.
      if (userInput.length < 150) {
        setHeadlineLimit(false);
        setHeadline(userInput);
      // If length of userInput is greater than or equal to maximum number, update headline to the allowed maximum amount of characters and ensure the limit alert is displayed.
      } else {
        setHeadlineLimit(true);
        setHeadline(userInput.slice(0, 149));
      }
    } else {
      if (userInput.length > 0 && reviewAlert === true) setReviewAlert(false);
      else if (userInput.length >= 150 && reviewAlert === 'not150') setReviewAlert(false);
      if ((userRating && userRating.review) && userInput !== userRating.review) setMainAlert(false);
      if (userInput.length < 4200) {
        setReviewLimit(false);
        setReview(userInput);
      } else {
        setReviewLimit(true);
        setReview(userInput.slice(0, 4199));
      }
    }
  }

  function conditionalAddOrUpdate (e) {
    e.preventDefault();
    if (userRating) {
      if (rating !== userRating.user_rating || (review !== userRating.review && review.length >= 150) || (headline !== userRating.headline && headline)) {
        console.log('UPDATING! review and movie ALL REQUIREMENTS MET');
        setShowQueryingDb(true);
        // console.log(rating, headline , review);
        updateOrAddReviewAndMovie('review', setReviewCompleted, rating, headline, review);
      } else if (rating === userRating.user_rating && (review === userRating.review && headline === userRating.headline)) setMainAlert(true);
    } else if ((!userRating && rating) && (headline && review.length >= 150)) {
      console.log('ADDING! review and adding or updating movie ALL REQUIREMENTS MET');
      // console.log(rating, headline , review);
      setShowQueryingDb(true);
      updateOrAddReviewAndMovie('review', setReviewCompleted, rating, headline, review);
    }

    if (!rating) setRatingAlert(true);
    if (!headline) setHeadlineAlert(true);
    if (!review) setReviewAlert(true);
    else if (review.length < 150) setReviewAlert('not150');
  }

  function closeReviewAndUpdate() {
    setUserReviews([]);
    setReviewMovie(false);
  }

  return ( 
    <div className={css.outerReviewMovie} onMouseDown={() => setReviewMovie(false)}>
      <div className={css.reviewMovie} onMouseDown={e => e.stopPropagation()}>
        <div className={css.closeBar}><IoClose className={css.closeReview} onClick={() => setReviewMovie(false)}/></div>
        <div className={css.reviewingMovieInfo}>
          <img src={posterPath} />
          <div className={css.infoAndAction}>
            <p className={css.titleAndYear}>{title} <span>({year})</span></p>
            { (!reviewCompleted && (!userRating || (userRating && !userRating.review))) && <p className={css.action}>Add item</p> }
            { (!reviewCompleted && userRating.review) && <p className={css.action}>Edit Item</p>}
            { reviewCompleted && <p className={css.action}>Submission successful</p>}
          </div>
        </div>
        { (!showQueryingDb && !reviewCompleted) && <form className={css.headlineAndReview} onSubmit={conditionalAddOrUpdate}>
          <div className={css.reviewRating}>
            <p>YOUR RATING</p>
            {createStars()}
            { ratingAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> Rating is required to add review.</div>}
          </div>
          <p>YOUR REVIEW</p>
          <input type="text" value={headline} placeholder="Write a headline for your review here" onChange={(e) => updateFieldsAndClearAlerts(e, 'headline')} />
          { headlineAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> A required field is missing.</div>}
          { headlineLimit && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> You have reached the maximum amount of the 150 characters allowed.</div>}
          <textarea value={review} placeholder="Write your review here" onChange={(e) => updateFieldsAndClearAlerts(e, 'review')}></textarea>
          { reviewAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> {reviewAlert === 'not150' ? 'Sorry, your review is too short. It needs to contain at least 150 characters.' : 'A required field is missing.'}</div>}
          { reviewLimit && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> You have reached the maximum amount of the 4200 characters allowed.</div>}
          { mainAlert && <div className={css.reviewAlert}><IoAlertCircleSharp className={css.alertIcon}/> There are no changes in your review to update.</div>}
          <button>Submit</button>
        </form> }
        { (showQueryingDb && !reviewCompleted) && <div className={css.reviewQuery}>
          <h3>Please give us a second while we process your submission.</h3>
          <div className={css.outerQueryAnimation}>
            <div className={css.reviewQueryAnimation}></div>
          </div>
        </div>}
        { reviewCompleted && <div className={css.reviewComplete}>
          <p>Thank you for contributing to MooViews!</p>
          <p className={css.completeMsg}>The information you have supplied has been processed and your review is now available for everyone to see. We love to hear from our MooViewers and hope to hear from you again soon!</p>
          <button onClick={closeReviewAndUpdate}>Ok</button>
        </div>}
      </div>
    </div>
   );
}
 
export default ReviewMovie;