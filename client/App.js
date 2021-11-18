import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home.jsx';
import Login from './containers/Login.jsx';
import Signup from './containers/Signup.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import MovieInfo from './containers/MovieInfo.jsx';
import ComingSoon from './containers/ComingSoon.jsx';
import TopRated from './containers/TopRated.jsx';
import './styles/index.css';


function App() {
  // adds the movie's id to imagesUnavailable object when an error occurs trying to fetch an image with given src. Once the id is added to imagesUnavailable the image error will then be displayed
  function imageErrorHandler(e, movieId, imageErrors, setImageErrors) {
    e.target.onerror = null;
    let newImageErrors = {...imageErrors};
    newImageErrors[movieId] = true;
    setImageErrors(newImageErrors);
  }


  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Home imageErrorHandler={imageErrorHandler} />
          </Route>
          <Route path='/top-rated'>
            <TopRated />
          </Route>
          <Route path='/coming-soon'>
            <ComingSoon imageErrorHandler={imageErrorHandler} />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/movie-info/:movie'>
            <MovieInfo />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
