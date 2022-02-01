import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import css from '../../styles/Navbar.module.css';
import SearchResult from './SearchResult.jsx';
import { AiOutlineSearch } from 'react-icons/ai';
import ConfirmSignout from './ConfirmSignout.jsx';

const Navbar = ({ imageErrorHandler, validatedUser }) => {
  const [keyword, setKeyword] = useState('');
  // using state to store search results from movie api to ensure data is dispayed in SearchResult component
  const [searchResult, setSearchResult] = useState(null);
  // using state to track whether search bar is focused and to determine if SearchResult component should be rendered
  const [focused, setFocused] = useState(false);
  // using state to ensure if an error does occur the error will be displayed
  const [error, setError] = useState(null);
  const [signout, setSignout] = useState(false);

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
    setSignout(false);
    if (route === currLocation) history.go(0);
  }

  function showAllResults(e) {
    // If the current page is All Results and user requests to see all results for a new keyword the current location in 'history' will be replaced with the new keyword then page will be refreshed. If current page is not All Results page will be redirected to All Results with given keyword.
    if (e.key === 'Enter' || e === 'clicked') {
      // console.log('Setkeyword ', setKeyword)
      // Sets the keyword to empty string so that when user navigates to a different page the input field is cleared.
      setKeyword('');
      // Sets signOut to false so the confirmSignout box is closed when user navigates to a different page.
      setSignout(false);
      if (location.indexOf('/all-results') !== -1) {
        history.replace(`/all-results/${keyword}`);
        history.go(0)
      } else history.push(`/all-results/${keyword}`);
    }
  }

  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} onClick={() => conditionalPageRefresh('/', location)} to='/' ><span className={css.moo}>Moo</span><span className={css.views}>Views</span></Link>
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
        <div className={css.inputAndIcon}>
          <input type='text' placeholder="Search movies" className={css.searchInput} onChange={onSearch} value={keyword} onKeyPress={showAllResults}></input>
          <AiOutlineSearch className={css.searchIcon} />
        </div>
        { (focused && searchResult) && 
          <div className={css.outerSearchResult}>
            <SearchResult searchResult={searchResult} keyword={keyword} setKeyword={setKeyword} setSignout={setSignout} showAllResults={showAllResults} imageErrorHandler={imageErrorHandler}/>
          </div> }
        { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/coming-soon', location)} to='/coming-soon'>Coming Soon</Link>
      <Link className={css.navlink} onClick={() => conditionalPageRefresh('/top-rated', location)} to='/top-rated'>Top Rated</Link>
      { !validatedUser && <Link className={css.navlink} onClick={() => conditionalPageRefresh('/login', location)} to='/login'>Sign In</Link>}
      { validatedUser && <ConfirmSignout signout={signout} setSignout={setSignout} /> }
    </nav>
  )
}

export default Navbar;