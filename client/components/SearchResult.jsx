import React, { useState } from 'react';
import css from '../styles/Navbar.module.css';

const SearchResult = ({ searchResult }) => {
  const topResults = [];
  for (let i = 0; i < searchResult.length; i++) {
    topResults.push(
      <div className={css.result} key={searchResult[i].id}>
        <p>{searchResult[i].title}</p>
        <p className={css.date}>{searchResult[i].release_date}</p>
      </div>
    )
  }
  return (
    <div className={css.searchResult}>
      {topResults.length < 1 && <p className={css.noResults}>No results found.</p>}
      {topResults}
    </div>
  )
}

export default SearchResult;