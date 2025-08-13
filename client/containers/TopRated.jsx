import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/TopRated.module.css';
import { AiFillStar } from 'react-icons/ai';
import { GiFilmProjector } from 'react-icons/gi';

const TopRated = ({ imageErrorHandler }) => {
  document.body.style.backgroundColor = 'white';
  document.title = 'Top 100 Movies - MooViews';
  const [topRated, setTopRated] = useState(null);
  const [TRimageErrors, setTRimageErrors] = useState({});

  useEffect(() => {
    const abortCont = new AbortController();
    fetch('/movie/top-rated', { signal: abortCont.signal })
      .then(res => res.json())
      .then(data => {
        console.log('Top Rated', data);
        setTopRated(data.topRated);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch Aborted')
        }
        console.log(err);
      })
    
    return () => abortCont.abort();
  }, [])

  function createTRloadingBox() {
    return (
      <div className={css.innerTopRated}>
        <div className={css.loadingTRmovie}>
          <div className="loadingDots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }

  return ( 
    <div className={css.topRated}>
      <div className={css.outerTitle}><h3 className={css.topRatedTitle}>Top 100 Movies</h3></div>
      { topRated && 
        <div className={css.innerTopRated}>
          <div className={css.columnNames}>
            <div><div className={css.colImage}></div></div>
            <div className={css.columnTitles}>
              <p className={css.colRankAndTitle}>Rank and Title</p>
              <p className={css.columnRating}>User <span>Rating</span></p>
              <p className={css.colVoteCount}>User <span>Votes</span></p>
            </div>
          </div>
          {topRated.map((movie, ind) => {
            return (
              <div className={css.topRatedMovie} key={movie.id}>
                { !TRimageErrors[movie.id] &&
                  <Link to={`/movie/${movie.id}`} className={css.TRimageLink}>
                    <img src={movie.poster_path} className={css.topRatedImage} onError={(e) => imageErrorHandler(e, movie.id, TRimageErrors, setTRimageErrors)}/>
                  </Link> }
                {TRimageErrors[movie.id] && 
                  <div className={css.topRatedImageUnavailable}>
                    <GiFilmProjector className={css.movieIcon} />
                  </div> }
                <div className={css.topRatedMovieInfo}>
                  <p className={css.rankAndTitle}> 
                    <span>{ind + 1}.</span>
                    <span><Link to={`/movie/${movie.id}`}>{movie.title}</Link></span>
                    <span>({movie.release_date})</span>
                  </p>
                  <p className={css.rating}><AiFillStar className={css.starIcon}/> { movie.vote_average }</p>
                  <p className={css.voteCount}> {movie.vote_count} </p>
                </div>
              </div>
            )
          })}
      </div> }
      { !topRated && createTRloadingBox()}
    </div>
   );
}
 
export default TopRated;