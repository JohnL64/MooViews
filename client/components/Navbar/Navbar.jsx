import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';

const Navbar = () => {
  // using state to store search results from movie api to ensure data is dispayed in SearchResult component
  const [searchResult, setSearchResult] = useState(null);
  // using state to track whether search bar is focused and to determine if SearchResult component should be rendered
  const [focused, setFocused] = useState(false);
  // using state to ensure if an error does occur the error will be displayed
  const [error, setError] = useState(null);

  // function to be invoked when any change occurs in the search input box and will make a request to server with the given keyword from user
  const onSearch = (e) => {
    fetch(`/movie/search?keyword=${e.target.value}`)
      .then(res => res.json())
      .then(data => {
        setSearchResult(data.movies);
      })
      .catch(err => {
        setError(err);
      })
  }


  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} to='/'><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link>
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
          <input type='text' className={css.searchInput} onChange={onSearch}></input>
          { (focused && searchResult) && <SearchResult searchResult={searchResult} /> }
          { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} to='/upcoming'>Coming Soon</Link>
      <Link className={css.navlink} to='/top-rated'>Top Rated</Link>
      <Link className={css.end} to='login'>Sign In</Link>
    </nav>
  )
}

export default Navbar;