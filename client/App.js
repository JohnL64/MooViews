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
  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/top-rated'>
            <TopRated />
          </Route>
          <Route path='/coming-soon'>
            <ComingSoon />
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
