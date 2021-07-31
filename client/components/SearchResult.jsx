import React, { useState } from 'react';
import css from '../styles/Navbar.module.css';

const SearchResult = ({ searchResult }) => {
  console.log(searchResult)
  let upToEight = 8;
  if (searchResult.length < 8) upToEight = searchResult.length;
  if (searchResult.length < 1) return (
    <p>No results found.</p>
  )
  const topResults = [];
  for (let i = 0; i < upToEight; i++) {
    console.log('here', searchResult)
    topResults.push(
      <div className={css.result} key={searchResult[i].id}>
        <p>{searchResult[i].original_title}</p>
        <p>{searchResult[i].release_date}</p>
      </div>
    )
  }
  return (
    <div className={css.searchResult}>
      {topResults}
    </div>
  )
}

export default SearchResult;