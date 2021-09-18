import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles/Navbar.module.css'
import SearchResult from './SearchResult.jsx';

const Navbar = () => {
  // api key for movie api
  const apiKey = '4cb4593eaec1b72711462d3b62f0196b'
  // creating state to store the data that is returned from movie API that the user has requested.
  const [searchResult, setSearchResult] = useState(null);
  // creating state to check if the search input box is in focus. When focused and a user has but in any input the results will render if. If not focused the results will disappear but data will still be stored.
  const [focused, setFocused] = useState(false);
  // if an error occurs, instead of the result the error message will be displayed.
  const [error, setError] = useState(null);

  // creating a function to changed the dates of the fetched data from the api so only the year will be displayed
  function changeDates(results) {
    for (let i = 0; i < results.length; i+=1) {
      results[i].release_date = results[i].release_date.slice(0, 4);
    }
  }

  // function that will be invoked when any change is found in the input box and will make a request to movie api with the current input the user has entered
  const onSearch = (e) => {
    // with this conditional, requests to the movie api will be made when there is at least one character inputted by the user. So if user removes all characters inputted this will not make a request until at least a single value is given.
    if (e.target.value !== '') {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${e.target.value}`)
      .then(res => res.json())
      .then(data => {
        // changing dates to only have year
        changeDates(data.results);
        // updating state to store recieved data after dates have been changed
        setSearchResult(data.results)
      })
      .catch(err => {
        // updating state to identify when an error has occured
        setError(err.status_message);
      })
    }
  }

  return (
    <nav className={css.navbar}>
      <Link className={css.navMooViews} to='home'><p className={css.moo}>Moo</p><p className={css.views}>Views</p></Link>
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