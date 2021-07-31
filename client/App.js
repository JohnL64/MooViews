import Home from './containers/Home.jsx';
import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <Route exact path='/'>
            { document.cookie.length > 0 && <Home /> }
            { !document.cookie.length > 0 && <Login /> }
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/home'>
            <Home />
          </Route>
        </Switch>
    </div>
    </Router>
  )
}

export default App;
