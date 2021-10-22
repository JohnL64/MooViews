import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Movies from './containers/Movies.jsx';
import Login from './containers/Login.jsx';
import Signup from './containers/Signup.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import MovieInfo from './containers/MovieInfo.jsx';
import './styles/index.css';


function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Movies />
          </Route>
          <Route path='/top-rated'>
            <Movies content='topRated'/>
          </Route>
          <Route path='/upcoming'>
            <Movies content='upcoming'/>
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
