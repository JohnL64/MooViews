import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './containers/Home.jsx';
import Login from './containers/Login.jsx';
import Signup from './containers/Signup.jsx';
import Navbar from './components/Navbar.jsx';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            {/* { document.cookie.length > 0 && <Home /> }
            { !document.cookie.length > 0 && <Login /> } */}
            {/* <Home /> */}
            <Login />
            {/* <Signup /> */}
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            {/* <Login /> */}
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
