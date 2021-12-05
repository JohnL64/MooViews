import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';
import { AiOutlineSearch } from 'react-icons/ai';

const Navbar = ({ imageErrorHandler }) => {
  const [keyword, setKeyword] = useState('');
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
    setKeyword(e.target.value);
    if (e.target.value.length > 0) {
      fetch(`/movie/search?keyword=${e.target.value}&page=1&content=navbar`)
      .then(res => res.json())
      .then(data => {
        setSearchResult(data.movies);
      })
      .catch(err => {
        setError(err);
      })
    } else setSearchResult(null);
  }

  function conditionalPageRefresh(route, currLocation) {
    // Changing keyword to empty string to clear search input field everytime page is changed or refreshed.
    setKeyword('');
    if (route === currLocation) history.go(0);
  }

  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} onClick={() => conditionalPageRefresh('/', location)} to='/' ><span className={css.moo}>Moo</span><span className={css.views}>Views</span></Link>
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
        <div className={css.inputAndIcon}>
          <input type='text' placeholder="Search movies" className={css.searchInput} onChange={onSearch} value={keyword}></input>
          <AiOutlineSearch className={css.searchIcon} />
        </div>
        { (focused && searchResult) && 
          <div className={css.outerSearchResult}>
            <SearchResult searchResult={searchResult} keyword={keyword} setKeyword={setKeyword} imageErrorHandler={imageErrorHandler}/>
          </div> }
        { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/coming-soon', location)} to='/coming-soon'>Coming Soon</Link>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/top-rated', location)} to='/top-rated'>Top Rated</Link>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/login', location)} to='/login'>Sign In</Link>
    </nav>
  )
}

export default Navbar;