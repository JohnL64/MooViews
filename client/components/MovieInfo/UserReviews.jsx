import React, { useState } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { MdAdd } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import { BsCircleFill } from 'react-icons/bs';

const UserReviews = ({ movieInfo }) => {
  const [userReviews, setUserReviews] = useState([movieInfo.latestReview]);

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
        { movieInfo.is_released && <div className={css.addReview}>
          <MdAdd className={css.plusIcon}/>
          <p>Review</p>
        </div>}
      </div>
      {(movieInfo.is_released && movieInfo.latestReview) && renderUserReviews()}
      { (movieInfo.is_released && !movieInfo.latestReview) && <p>There are no reviews for this movie yet. Be the first one to write one!</p>}
      { !movieInfo.is_released && <p>This movie can't be reviewed at this current time. Come back to write a review once it has been released!</p>}
    </div> 
  );
}
 
export default UserReviews;