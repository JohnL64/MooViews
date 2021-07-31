import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';

const Navbar = () => {
  // api key for movie api
  const apiKey = '4cb4593eaec1b72711462d3b62f0196b'
  // 
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(null);

  const onSearch = (e) => {
    setSearchInput(e.target.value);

      if (e.target.value !== '') {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${e.target.value}`)
        .then(res => res.json())
        .then(data => {
          setSearchResult(data.results)
        })
        .catch(err => {
          setError(err.status_message);
        })
      }
  }

  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} to='home'><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link>
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
          <input type='text' className={css.searchInput} value={searchInput} onChange={onSearch}></input>
          { (focused && searchResult) && <SearchResult searchResult={searchResult} /> }
          { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} to='trending'>Trending</Link>
      <Link className={css.navlink} to='topRated'>Top Rated</Link>
      <Link className={css.navlink} to='topRated'>Sign In</Link>
    </nav>
  )
}

export default Navbar;