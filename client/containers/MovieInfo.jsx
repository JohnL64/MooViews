import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import css from "../styles/MovieInfo.module.css";
import CrewAndSummary from '../components/MovieInfo/CrewAndSummary.jsx';
import { GiFilmProjector } from 'react-icons/gi';
import MovieHeader from '../components/MovieInfo/MovieHeader.jsx';

const MovieInfo = ({ imageErrorHandler}) => {
  const { movie } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [MIimageErrors, setMIimageErrors] = useState({});

  useEffect(() => {
    fetch(`/movie/movie-info?id=${movie}`)
      .then(res => res.json())
      .then(data => {
        setMovieInfo(data.movieInfo);
        console.log(data);
      })
  }, []);

  function getCast(castArr) {
    return castArr.map(star => {
      return (
        <div className={css.star} key={star.name}>
          <img src={star.profile_path}/>
          <p>{star.name}</p>
          <p>as {star.character}</p>
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
              <MovieHeader movieInfo={movieInfo}/>
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
              <h2>Cast</h2>
              {getCast(movieInfo.credits.updatedCast)}
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