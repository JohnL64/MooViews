import React, { useState } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { MdAdd } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import { BsCircleFill } from 'react-icons/bs';
import ReviewMovie from './ReviewMovie.jsx';

const UserReviews = ({ movieInfo, userRating, updateOrAddReviewAndMovie }) => {
  const [userReviews, setUserReviews] = useState([movieInfo.latestReview]);
  const [reviewMovie, setReviewMovie] = useState(false);

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
          <p className={css.writtenReview}>{review.review}</p>
          <div className={css.userAndDate}>
            <p>{review.username}</p>
            <BsCircleFill className={css.userBulletIcon}/>
            <p>{review.date}</p>
          </div>
        </div>
      )
    }

    function getMoreUserReviews() {
      fetch(`/movie/user-reviews?id=${movieInfo.id}&reviewsShown=${userReviews.length}`)
        .then(res => res.json())
        .then(data => {
          setUserReviews([...userReviews, ...data.reviewsToDisplay]);
        })
    }

    return (
      <div>
        {reviewsArr}
        <p className={css.reviewsDisplayed}>Showing {userReviews.length} of {movieInfo.dbRating.review_count} review{movieInfo.dbRating.review_count > 1 && 's'}</p>
        { (movieInfo.dbRating.review_count > 1 && userReviews.length < movieInfo.dbRating.review_count) && <div className={css.showMoreOnly} onClick={getMoreUserReviews}><p>See more reviews</p></div> }
      </div>
    )
  }

  return ( 
    <div className={css.userReviews}>
      <div className={css.reviewsTitleAndBtn}>
        <h2 className={css.userTitle}>User Reviews</h2>
        { movieInfo.is_released && <div className={css.addReview} onClick={() => setReviewMovie(true)}>
          <MdAdd className={css.plusIcon}/>
          <p>Review</p>
        </div>}
      </div>
      {(movieInfo.is_released && movieInfo.latestReview) && renderUserReviews()}
      { (movieInfo.is_released && !movieInfo.latestReview) && <p className={css.noReviews}>There are no reviews for this movie yet. Be the first one to write one!</p>}
      { !movieInfo.is_released && <p className={css.notReleased}>This movie can't be reviewed at this current time. Come back to write a review once it has been released!</p>}
      {/* 
      Data required for ReviewMovie
      - poster path
      - title
      - year
      - user rating
      - 
      */}
      { (reviewMovie && userRating !== null) && <ReviewMovie setReviewMovie={setReviewMovie} posterPath={movieInfo.poster_path} title={movieInfo.title} year={movieInfo.year} userRating={userRating} updateOrAddReviewAndMovie={updateOrAddReviewAndMovie} /> }
    </div>
  );
}
 
export default UserReviews;