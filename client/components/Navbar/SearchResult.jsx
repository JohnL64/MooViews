import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import css from '../../styles/Navbar.module.css';

const SearchResult = ({ searchResult, keyword }) => {
  const history = useHistory();
  const topResults = [];

  for (let i = 0; i < 8; i++) {
    let movie = searchResult[i];
    topResults.push(
      <div className={css.result} key={movie.id} onMouseDown={() => history.push(`/movie/${movie.id}`)}>
        <p>{movie.title}</p>
        <p className={css.date}>{movie.release_date}</p>
      </div>
    )
  }

  return (
    <div className={css.searchResult}>
      {topResults.length < 1 && <p className={css.noResults}>No results found.</p>}
      {topResults}
      {searchResult.length > 8 && <p onMouseDown={() => history.push(`/all-results/${keyword}`)}>See all results for {keyword}</p> }
    </div>
  )
}

export default SearchResult;