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
    // console.log(searchResult[i].release_date[01])
    // let year = searchResult[i].release_date.slice(0, 4);
    // let test = 'Testing to check something'
    topResults.push(
      <div className={css.result} key={searchResult[i].id}>
        <p>{searchResult[i].original_title}</p>
        <p className={css.date}>{searchResult[i].release_date}</p>
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