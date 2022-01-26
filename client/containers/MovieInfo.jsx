import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import css from "../styles/MovieInfo.module.css";
import CrewAndSummary from '../components/MovieInfo/CrewAndSummary.jsx';
import { GiFilmProjector } from 'react-icons/gi';
import { BsFillPersonFill } from 'react-icons/bs';
import MovieHeader from '../components/MovieInfo/MovieHeader.jsx';
import UserReviews from '../components/MovieInfo/UserReviews.jsx';

const MovieInfo = ({ imageErrorHandler, validatedUser}) => {
  document.body.style.backgroundColor = 'white';
  const { movie } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [MIimageErrors, setMIimageErrors] = useState({});
  const [userRating, setUserRating] = useState(null);
  console.log('USER RATING: ', userRating);
  console.log('MOVIE INFO: ', movieInfo);

  useEffect(async () => {
    await fetch(`/movie/movie-info?id=${movie}`)
      .then(res => res.json())
      .then(data => {
        // console.log('MOVIE INFO: ', data.movieInfo);
        setMovieInfo(data.movieInfo);
      })
      .catch(err => {
          console.log(err);
      })

      if (validatedUser) {
        fetch(`/movie/user-rating?id=${movie}`)
          .then(res => res.json())
          .then(data => {
            // console.log('USER RATING: ', data.userRating);
            setUserRating(data.userRating);
          })
          .catch(err => {
            console.log(err);
          })
      }
  }, []);

  function getCast(castArr) {
    return castArr.map(star => {
      return (
        <div className={css.star} key={star.name}>
          { star.profile_path && !MIimageErrors.hasOwnProperty(star.id) && <img src={star.profile_path} onError={(e) => imageErrorHandler(e, star.id, MIimageErrors, setMIimageErrors)}/>}
          { (!star.profile_path || MIimageErrors.hasOwnProperty(star.id)) && <div className={css.starImgUnavailable}><BsFillPersonFill className={css.personIcon} /></div>}
          <div className={css.starInfo}>
            <p>{star.name}</p>
            <p>as {star.character}</p>
          </div>
        </div>
      )
    })
  }

  async function updateOrAddReviewAndMovie(ratingOrReview, actionAfterSubmit, rating, headline, review) {
    // console.log('Inside updateOrAdd: !!!!!!', rating, headline, review);
    const { dbRating, latestReview, id, tmdb_vote_count, vote_average } = movieInfo;
    const previousUserRating = userRating.user_rating;
    const previousUserReview = userRating.review;
    let newUserRating;
    let reviewedUserIsCurrentUser;
    // Setting userRating to null so that the loading circle and 'Rate' text are shown when adding/updating rating and movie to database.
    if (ratingOrReview === 'rating') {
      actionAfterSubmit(false);
      setUserRating(null);
    }

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

    function customFetch(route, method, bodyObj, action) {
      return fetch(route, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj)
      })
        .then(res => res.json())
        .then(data => {
          if (action === 'updateRating' || action === 'addRating') {
            newUserRating = data.userRating;
            reviewedUserIsCurrentUser = data.reviewedUserIsCurrentUser;
            console.log("Rating changes applied");
          } else {
            console.log('Movie changes applied');
            updateMovieRating(data.newDbRating, newUserRating, reviewedUserIsCurrentUser);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (!previousUserRating) {
      const reqBody = { id, rating, headline, review};
      console.log('Object when sent with request when review is being added!!!!', reqBody);
      await customFetch('/movie/user-rating', 'POST', reqBody, 'addRating');
    } else {
      const reqBody = { id, rating, headline, review, latestReview};
      await customFetch('/movie/user-rating', 'PATCH', reqBody, 'updateRating');
    }
    console.log('After rating update', newUserRating);
    if (!dbRating)  {
      const reqBody = { id, rating, tmdb_vote_count, vote_average, ratingOrReview};
      customFetch('/movie/movie-info', 'POST', reqBody, 'addMovie');
    } else {
      const reqBody = { dbRating, id, rating, previousUserRating, previousUserReview, ratingOrReview};
      customFetch('/movie/movie-info', 'PATCH', reqBody, 'updateMovie');
    }
  }

  

  return (
    <div className={css.movieInfo}>
      { 
        movieInfo && 
        <div className={css.innerMovieInfo}>
          <section className={css.genInfoAndMedia}>
            <div className={css.infoAndMediaContent}>
              <MovieHeader movieInfo={movieInfo} setMovieInfo={setMovieInfo} validatedUser={validatedUser} userRating={userRating} setUserRating={setUserRating} updateOrAddReviewAndMovie={updateOrAddReviewAndMovie}/>
              <div className={css.movieMedia}>
                { (movieInfo.poster_path && !MIimageErrors.hasOwnProperty(movieInfo.id)) && <img src={movieInfo.poster_path} onError={(e) => imageErrorHandler(e, movieInfo.id, MIimageErrors, setMIimageErrors)}/>}
                { (!movieInfo.poster_path || MIimageErrors.hasOwnProperty(movieInfo.id)) && <div className={css.unavailableImage}><GiFilmProjector className={css.filmIcon} /></div> }
                { movieInfo.videos ? <iframe src={movieInfo.videos} allow="fullscreen"></iframe> : <CrewAndSummary updatedCrew={movieInfo.credits.updatedCrew} overview={movieInfo.overview} video={false}/>}
              </div>
              { movieInfo.videos && <CrewAndSummary updatedCrew={movieInfo.credits.updatedCrew} overview={movieInfo.overview} video={true}/> }
            </div>
          </section>

          <section className={css.castAndReviews}>
            <div className={css.cast}>
              <h2 className={css.castTitle}>Top Cast</h2>
              { movieInfo.credits.updatedCast.length > 0 ? <div className={css.castList}>
                {getCast(movieInfo.credits.updatedCast)}
              </div> : <p>The cast has yet to be added.</p>}
            </div>
            <UserReviews movieInfo={movieInfo} userRating={userRating} updateOrAddReviewAndMovie={updateOrAddReviewAndMovie} validatedUser={validatedUser}/>
          </section>

        </div>
      }
    </div>
  );
}
 
export default MovieInfo;