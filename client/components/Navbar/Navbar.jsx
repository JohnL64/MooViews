import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';
import { AiOutlineSearch } from 'react-icons/ai';

const Navbar = () => {
  // using state to store search results from movie api to ensure data is dispayed in SearchResult component
  const [searchResult, setSearchResult] = useState(null);
  // using state to track whether search bar is focused and to determine if SearchResult component should be rendered
  const [focused, setFocused] = useState(false);
  // using state to ensure if an error does occur the error will be displayed
  const [error, setError] = useState(null);

  const history = useHistory();
  const location = useLocation().pathname;
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

  function conditionalPageRefresh(route, currLocation) {
    if (route === currLocation) history.go(0);
  }

  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} onClick={() => conditionalPageRefresh('/', location)} to='/' ><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link>
      {/* <Link className={css.navMooViews} onClick={() => conditionalPageRefresh('/', location)}><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link> */}
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
        <div className={css.inputAndIcon}>
          <input type='text' placeholder="Search for movies" className={css.searchInput} onChange={onSearch}></input>
          <AiOutlineSearch className={css.searchIcon} />
        </div>
        { (focused && searchResult) && 
          <div className={css.outerSearchResult}>
            <SearchResult searchResult={searchResult} />
          </div> }
        { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/coming-soon', location)} to='/coming-soon'>Coming Soon</Link>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/top-rated', location)} to='/top-rated'>Top Rated</Link>
      <Link className={css.end} onClick={() => conditionalPageRefresh('/login', location)} to='/login'>Sign In</Link>
    </nav>
  )
}

export default Navbar;