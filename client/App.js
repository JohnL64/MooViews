import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home.jsx';
import Login from './containers/Login.jsx';
import Signup from './containers/Signup.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import MovieInfo from './containers/MovieInfo.jsx';
import ComingSoon from './containers/ComingSoon.jsx';
import TopRated from './containers/TopRated.jsx';
import AllResults from './containers/AllResults.jsx';
import './styles/index.css';


function App() {
  const [validatedUser, setValidatedUser] = useState(null);
  useEffect(() => {
    fetch('/isAuthenticatedUser')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setValidatedUser(data.isValidated);
        // if (location !== '/') history.push('/');
      })
  }, [])
  // adds the movie's id to imagesUnavailable object when an error occurs trying to fetch an image with given src. Once the id is added to imagesUnavailable the image error will then be displayed
  function imageErrorHandler(e, movieId, imageErrors, setImageErrors) {
    e.target.onerror = null;
    let newImageErrors = {...imageErrors};
    newImageErrors[movieId] = true;
    setImageErrors(newImageErrors);
  }


  return (
    <Router>
      { (validatedUser !== null) && <div className='app'>
        <Navbar imageErrorHandler={imageErrorHandler} validatedUser={validatedUser} />
        <Switch>
          <Route exact path='/'>
            <Home imageErrorHandler={imageErrorHandler} />
          </Route>
          <Route path='/popular/:page' render={(props) => (<Home key={props.match.params.page} imageErrorHandler={imageErrorHandler} />)}/>
          <Route path='/top-rated'>
            <TopRated imageErrorHandler={imageErrorHandler} />
          </Route>
          <Route path='/coming-soon'>
            <ComingSoon imageErrorHandler={imageErrorHandler} />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login setValidatedUser={setValidatedUser} />
          </Route>
          <Route path='/movie/:movie' render={(props) => (<MovieInfo key={props.match.params.movie} imageErrorHandler={imageErrorHandler} validatedUser={validatedUser}/>)}/>
          <Route path='/all-results/:keyWord'>
            <AllResults imageErrorHandler={imageErrorHandler}/>
          </Route>
        </Switch>
      </div> }
    </Router>
  )
}

export default App;
