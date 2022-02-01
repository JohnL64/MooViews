import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css';
import { GiFilmProjector } from 'react-icons/gi';

const SearchResult = ({ searchResult, keyword, setKeyword, setSignout, showAllResults, imageErrorHandler }) => {
  const [SRimageErrors, setSRimageErrors] = useState({});
  const history = useHistory();
  const location = useLocation().pathname;
  const topResults = [];

  let numOfMovies = 8;
  if (searchResult.length < 8) numOfMovies = searchResult.length;

  function showMovieInfo(movieId) {
    if (location.indexOf('/movie') !== -1) {
      history.replace(`/movie/${movieId}`);
      history.go(0);
    } else {
      history.push(`/movie/${movieId}`);
      setKeyword('');
      setSignout(false);
    }
  }

  if (searchResult.length > 0) {
    for (let i = 0; i < numOfMovies; i += 1) {
      const movie = searchResult[i];
      topResults.push(
        <div className={css.result} key={movie.id} onMouseDown={() => showMovieInfo(movie.id)}>
          { (movie.poster_path && !SRimageErrors[movie.id]) && <img className={css.SRimage} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, SRimageErrors, setSRimageErrors)}/> }
          { (!movie.poster_path || SRimageErrors[movie.id]) && 
            <div className={css.SRimageUnavailable}>
              <GiFilmProjector className={css.SRmovieIcon} />
            </div> }
          <div className={css.SRinfo}>
            <p className={css.SRtitle}>{movie.title}</p>
            <p className={css.date}>{movie.release_date}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={css.searchResult}>
      {searchResult.length < 1 && <p className={css.noResults}>No results found.</p>}
      {keyword.length > 0 && topResults}
      {(searchResult.length > 8 && keyword.length > 0) && 
        <div className={css.outerAllResults} onMouseDown={() => showAllResults('clicked')}>
          <p className={css.allResults} >See all results for "{keyword}"</p>
        </div> }
    </div>
  )
}

export default SearchResult;