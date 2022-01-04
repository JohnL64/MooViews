import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import css from "../styles/MovieInfo.module.css";
import CrewAndSummary from '../components/MovieInfo/CrewAndSummary.jsx';
import { GiFilmProjector } from 'react-icons/gi';
import { BsFillPersonFill } from 'react-icons/bs';
import MovieHeader from '../components/MovieInfo/MovieHeader.jsx';

const MovieInfo = ({ imageErrorHandler, validatedUser}) => {
  document.body.style.backgroundColor = 'white';
  const { movie } = useParams();
  console.log(movie);
  console.log('User is signed in : ', validatedUser)
  const [movieInfo, setMovieInfo] = useState(null);
  const [MIimageErrors, setMIimageErrors] = useState({});
  const [userRating, setUserRating] = useState(null);

  useEffect(async () => {
    await fetch(`/movie/movie-info?id=${movie}`)
      .then(res => res.json())
      .then(data => {
        setMovieInfo(data.movieInfo);
        console.log(data);
      })
      .catch(err => {
          console.log(err);
      })

      if (validatedUser) {
        fetch(`/movie/user-rating?id=${movie}`)
          .then(res => res.json())
          .then(data => {
            console.log("User rating status: ", data);
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

  return (
    <div className={css.movieInfo}>
      { 
        movieInfo && 
        <div className={css.innerMovieInfo}>
          <section className={css.genInfoAndMedia}>
            <div className={css.infoAndMediaContent}>
              <MovieHeader movieInfo={movieInfo} validatedUser={validatedUser} userRating={userRating}/>
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
            <div className={css.userReviews}>
              <h2>User Reviews</h2>
            </div>
          </section>

        </div>
      }
    </div>
  );
}
 
export default MovieInfo;