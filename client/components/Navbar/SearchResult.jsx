import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css';
import { GiFilmProjector } from 'react-icons/gi';

const SearchResult = ({ searchResult, keyword, setKeyword, imageErrorHandler }) => {
  const [SRimageErrors, setSRimageErrors] = useState({});
  const history = useHistory();
  const location = useLocation().pathname;
  const topResults = [];

  let numOfMovies = 8;
  if (searchResult.length < 8) numOfMovies = searchResult.length;

  function conditionalPageRefresh(route, currLocation) {
    // If the current page is All Results and user requests to see all results for a new keyword the current location in 'history' will be replaced with the new keyword then page will be refreshed. If current page is not All Results page will be redirected to All Results with given keyword.
    setKeyword('');
    if (location.indexOf('/all-results') !== -1) {
      history.replace(`/all-results/${keyword}`);
      history.go(0)
    } else history.push(`/all-results/${keyword}`);
  }

  if (searchResult.length > 0) {
    for (let i = 0; i < numOfMovies; i += 1) {
      const movie = searchResult[i];
      topResults.push(
        <div className={css.result} key={movie.id} onMouseDown={() => history.push(`/movie/${movie.id}`)}>
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
        <div className={css.outerAllResults} onMouseDown={() => conditionalPageRefresh()}>
          <p className={css.allResults} >See all results for "{keyword}"</p>
        </div> }
    </div>
  )
}

export default SearchResult;