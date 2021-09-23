import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';

const Navbar = () => {
  // creating state to store the data that is returned from movie API that the user has requested.
  const [searchResult, setSearchResult] = useState(null);
  // creating state to check if the search input box is in focus. When focused and a user has but in any input the results will render if. If not focused the results will disappear but data will still be stored.
  const [focused, setFocused] = useState(false);
  // if an error occurs, instead of the result the error message will be displayed.
  const [error, setError] = useState(null);

  // function that will be invoked when any change is found in the input box and will make a request to server with the input the user has entered
  const onSearch = (e) => {
    // with this conditional, requests to the server will be made when there is at least one character inputted by the user. So if user removes all characters inputted this will not make a request until at least a single value is given.
    if (e.target.value !== '') {
    fetch(`/movie/search?keyword=${e.target.value}`)
      .then(res => res.json())
      .then(data => {
        setSearchResult(data.movies);
      })
      .catch(err => {
        setError(err);
      })
    }
  }


  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} to='/'><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link>
      <div className={css.searchBar} onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)}>
          <input type='text' className={css.searchInput} onChange={onSearch}></input>
          { (focused && searchResult) && <SearchResult searchResult={searchResult} /> }
          { error && <p>{error}</p>}
      </div>
      <Link className={css.navlink} to='/'>Trending</Link>
      <Link className={css.navlink} to='topRated'>Top Rated</Link>
      <Link className={css.end} to='login'>Sign In</Link>
    </nav>
  )
}

export default Navbar;