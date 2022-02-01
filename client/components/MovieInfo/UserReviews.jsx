import React, { useState, useEffect } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { MdAdd } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import { BsCircleFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import ReviewMovie from './ReviewMovie.jsx';
import { useHistory } from 'react-router-dom';

const UserReviews = ({ movieInfo, userRating, updateOrAddReviewAndMovie, validatedUser }) => {
  const [userReviews, setUserReviews] = useState([]);
  const [reviewMovie, setReviewMovie] = useState(false);
  const [fullReview, setFullReview] = useState({});
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const history = useHistory();

  // Once component is mounted checks to see if the 'review' text has overflowed in the p element. The overflowed p elements will be added to fullReview object which is checked to see if a user review should have the "show full review" button and once clicked also referenced to determine if the full review should be showed.
  function addOverflowingReviews() {
    const newFullReview = {};
    for (let i = 0; i < userReviews.length; i += 1) {
      const writtenReview = document.getElementById(`review${i}`);
      // If the user has already clicked the "show full review" button and the full review is being displayed this conditional will ensure this will stay the same even after the next update.
      if (fullReview[`review${i}`]) newFullReview[`review${i}`] = true;
      else if (writtenReview && (writtenReview.scrollHeight > writtenReview.clientHeight)) {
        newFullReview[`review${i}`] = false;
      }
    }
    setFullReview(newFullReview);
  }

  // If user resizes windows invoke addOverflowingReviews to check if the 'review' text is overflowing in its paragraph element. If text is overflowing the button to show all text will be available.
  // window.addEventListener('onresize', addOverflowingReviews);
  window.onresize = addOverflowingReviews;

  useEffect(() => {
    if (userReviews.length < 1 && (movieInfo.dbRating && movieInfo.dbRating.review_count)) {
      fetch(`/movie/user-reviews?id=${movieInfo.id}&limit=3&reviewsShown=${userReviews.length}`)
        .then(res => res.json())
        .then(data => {
          setUserReviews(data.reviewsToDisplay);
        })
    } 
    addOverflowingReviews();
  }, [userReviews]);

  function getMoreUserReviews() {
    setLoadingMoreReviews(true);
    fetch(`/movie/user-reviews?id=${movieInfo.id}&limit=12&reviewsShown=${userReviews.length}`)
      .then(res => res.json())
      .then(data => {
        setLoadingMoreReviews(false);
        setUserReviews([...userReviews, ...data.reviewsToDisplay]);
      })
  }

  function showFullReview(review) {
    const newFullReview = { ...fullReview };
    newFullReview[review] = true;
    setFullReview(newFullReview);
  }

  function renderUserReviews() {
    const reviewsArr = [];
    for (let i = 0; i < userReviews.length; i += 1) {
      const review = userReviews[i];
      reviewsArr.push(
        <div className={css.userReview} key={review._id}>
          <div className={css.headlineRating}>
            <p>{review.headline}</p>
            <p><AiFillStar className={css.reviewStarIcon}/> {review.user_rating}<span>/10</span></p>
          </div>
          { !fullReview[`review${i}`] && <p className={css.writtenReview} id={`review${i}`}>{review.review}</p> }
          { fullReview[`review${i}`] && <p className={css.fullWrittenReview} id={`review${i}`}>{review.review}</p> } 
          <div className={css.reviewBottom}>
            <div className={css.userAndDate}>
              <p>{review.username}</p>
              <BsCircleFill className={css.userBulletIcon}/>
              <p>{review.date}</p>
            </div>
            { (fullReview.hasOwnProperty(`review${i}`) && !fullReview[`review${i}`]) && <FaChevronDown className={css.showMoreIcon} onClick={() => showFullReview(`review${i}`)}/>}
          </div>
        </div>
      )
    }

    return (
      <div>
        {reviewsArr}
        <p className={css.reviewsDisplayed}>Showing {userReviews.length} of {movieInfo.dbRating.review_count} review{movieInfo.dbRating.review_count > 1 && 's'}</p>
        { (userReviews.length < movieInfo.dbRating.review_count) && <div className={css.showMoreOnly} onClick={getMoreUserReviews}>
          { !loadingMoreReviews && <p>See more reviews</p> }
          { loadingMoreReviews && <div className="smallLoadDots">
            <div></div>
            <div></div>
            <div></div>
          </div>}
        </div> }
        
      </div>
    )
  }

  function authorizedUserForReview() {
    if (validatedUser) setReviewMovie(true);
    else history.push('/login');
  }

  return ( 
    <div className={css.userReviews}>
      <div className={css.reviewsTitleAndBtn}>
        <h2 className={css.userTitle}>User Reviews</h2>
        { movieInfo.is_released && <div className={css.addReview} onClick={authorizedUserForReview}>
          <MdAdd className={css.plusIcon}/>
          <p>Review</p>
        </div>}
      </div>
      {(movieInfo.dbRating && movieInfo.dbRating.review_count && userReviews.length > 0) && renderUserReviews()}
      {(movieInfo.dbRating && movieInfo.dbRating.review_count && userReviews.length < 1) && <div className={css.loadingReviews}>
        <div className="loadingDots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>}
      { (movieInfo.is_released && (!movieInfo.dbRating || !movieInfo.dbRating.review_count)) && <p className={css.noReviews}>There are no reviews for this movie yet. Be the first one to write one!</p>}
      { !movieInfo.is_released && <p className={css.notReleased}>This movie can't be reviewed at this current time. Come back to write a review once it has been released!</p>}
      { reviewMovie && <ReviewMovie setReviewMovie={setReviewMovie} setUserReviews={setUserReviews} posterPath={movieInfo.poster_path} title={movieInfo.title} year={movieInfo.year} userRating={userRating} updateOrAddReviewAndMovie={updateOrAddReviewAndMovie} /> }
    </div>
  );
}
 
export default UserReviews;