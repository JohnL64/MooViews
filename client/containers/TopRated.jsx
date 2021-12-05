import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/TopRated.module.css';
import { AiFillStar } from 'react-icons/ai';
import { GiFilmProjector } from 'react-icons/gi';

const TopRated = ({ imageErrorHandler }) => {
  document.body.style.backgroundColor = 'black';
  const [topRated, setTopRated] = useState(null);
  const [TRimageErrors, setTRimageErrors] = useState({});

  useEffect(() => {
    fetch('/movie/top-rated')
      .then(res => res.json())
      .then(data => {
        console.log('Top Rated', data);
        setTopRated(data.topRated);
      })
  }, [])

  function createTRloadingBox() {
    return (
      <div className={css.TRloadingBox}>
          <div className="loadingDots">
            <div></div>
            <div></div>
            <div></div>
          </div>
      </div>
    )
  }

  return ( 
    <div className={css.topRated}>
      <h2 className={css.TRtitle}>Top 100</h2>
      { topRated && 
        <div className={css.innerTR}>
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
              <div className={css.TRmovie} key={movie.id}>
                { !TRimageErrors[movie.id] &&
                  <Link to={`/movie/${movie.id}`} className={css.TRimageLink}>
                    <img src={movie.poster_path} className={css.TRimage} onError={(e) => imageErrorHandler(e, movie.id, TRimageErrors, setTRimageErrors)}/>
                  </Link> }
                {TRimageErrors[movie.id] && 
                  <div className={css.TRimageUnavailable}>
                    <GiFilmProjector className={css.movieIcon} />
                  </div> }
                <div className={css.TRmovieInfo}>
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