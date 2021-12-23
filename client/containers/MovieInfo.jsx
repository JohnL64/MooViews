import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import css from "../styles/MovieInfo.module.css";
import { AiFillStar } from 'react-icons/ai';

const MovieInfo = () => {
  document.body.style.backgroundColor = 'black';
  const { movie } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);

  useEffect(() => {
    fetch(`/movie/movie-info?id=${movie}`)
      .then(res => res.json())
      .then(data => {
        setMovieInfo(data.movieInfo);
        console.log(data);
      })
  }, []);

  function getCrew(jobArr) {
    const peopleArr = [];
    for (let i = 0; i < jobArr.length; i += 1) {
      if (i !== jobArr.length - 1) peopleArr.push(<span key={jobArr[i]}>{ jobArr[i] + ', ' }</span>);
      else peopleArr.push(<span key={jobArr[i]}>{ jobArr[i] }</span>);
    }
    return peopleArr;
  }

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
      {/* <h2>Movie Id {movie}</h2> */}
      { 
        movieInfo && 
        <div className={css.innerMovieInfo}>
          <div className={css.topMovieInfo}>
            <h1>{movieInfo.title}</h1>
            <div className={css.generalInfo}>
              <p>{movieInfo.rating}</p>
              <p>{movieInfo.year}</p>
              <p>{movieInfo.genres}</p>
              <p>{movieInfo.runtime}</p>
            </div>
            <div><AiFillStar/>{movieInfo.vote_average}</div>
            <div className={css.movieMedia}>
              <img src={movieInfo.poster_path}/>
              <iframe src={movieInfo.videos}>hello</iframe>
            </div>
            <div className={movieInfo.crewAndSummary}>
              <p>{movieInfo.overview}</p>
              <p>Director: {getCrew(movieInfo.credits.updatedCrew.Director)}</p>
              <p>Writer: {getCrew(movieInfo.credits.updatedCrew.Writer)}</p>
              <p>Producer: {getCrew(movieInfo.credits.updatedCrew.Producer)}</p>
            </div> 
          </div>
          <div className={css.bottomMovieInfo}>
            <div className={css.cast}>
              <h2>Cast</h2>
              {getCast(movieInfo.credits.updatedCast)}
            </div>
            <div className={css.userReviews}>
              <h2>User Reviews</h2>
            </div>
          </div>

        </div>
      }
    </div>
  );
}
 
export default MovieInfo;