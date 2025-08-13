import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css';
import { GiFilmProjector } from 'react-icons/gi';

const SearchResult = ({ searchResult, keyword, showAllResults, imageErrorHandler }) => {
  const [SRimageErrors, setSRimageErrors] = useState({});
  const history = useHistory();
  const location = useLocation().pathname;
  const topResults = [];

  let numOfMovies = 8;
  if (searchResult.length < 8) numOfMovies = searchResult.length;

  if (searchResult.length > 0) {
    for (let i = 0; i < numOfMovies; i += 1) {
      const movie = searchResult[i];
      topResults.push(
        <div className={css.result} key={movie.id} onMouseDown={() => history.push(`/movie/${movie.id}`)}>
          { (movie.poster_path && !SRimageErrors[movie.id]) && <img className={css.searchResultImage} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, SRimageErrors, setSRimageErrors)}/> }
          { (!movie.poster_path || SRimageErrors[movie.id]) && 
            <div className={css.searchResultImageUnavailable}>
              <GiFilmProjector className={css.searchResultMovieIcon} />
            </div> }
          <div className={css.searchResultInfo}>
            <p>{movie.title}</p>
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