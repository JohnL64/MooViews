import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Home from './containers/Home.jsx';
const Home = lazy(() => import('./containers/Home.jsx'));
const Login = lazy(() => import('./containers/Login.jsx'));
const Signup = lazy(() => import('./containers/Signup.jsx'));
import Navbar from './components/Navbar/Navbar.jsx';
const MovieInfo = lazy(() => import('./containers/MovieInfo.jsx'));
const ComingSoon = lazy(() => import('./containers/ComingSoon.jsx'));
const TopRated = lazy(() => import('./containers/TopRated.jsx'));
const AllResults = lazy(() => import('./containers/AllResults.jsx'));
import './styles/index.css';


function App() {
  const [validatedUser, setValidatedUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [signout, setSignout] = useState(false);
  
  const [test, setTest] = useState(true);

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

  function resetNavbar() {
    setKeyword('');
    setSignout(false);
  }

  return (
    <Router>
      { (validatedUser !== null) && <div className='app'>
        <Navbar keyword={keyword} setKeyword={setKeyword} signout={signout} setSignout={setSignout} imageErrorHandler={imageErrorHandler} validatedUser={validatedUser}/>
        <Switch>
          <Suspense fallback={<div></div>}>
            <Route exact path='/'>
              <Home imageErrorHandler={imageErrorHandler} resetNavbar={resetNavbar}/>
            </Route>
            <Route path='/popular/:page' render={(props) => (<Home key={props.match.params.page} imageErrorHandler={imageErrorHandler} resetNavbar={resetNavbar}/>)}/>
            <Route path='/top-rated'>
              <TopRated imageErrorHandler={imageErrorHandler}/>
            </Route>
            <Route path='/coming-soon/:page'>
              <ComingSoon imageErrorHandler={imageErrorHandler}/>
            </Route>
            <Route path='/signup'>
              <Signup setValidatedUser={setValidatedUser} resetNavbar={resetNavbar}/>
            </Route>
            <Route path='/login'>
              <Login setValidatedUser={setValidatedUser} resetNavbar={resetNavbar}/>
            </Route>
            {/* <Route path='/movie/:movie' render={(props) => (<MovieInfo key={props.match.params.movie} imageErrorHandler={imageErrorHandler} validatedUser={validatedUser} resetNavbar={resetNavbar}/>)}/> */}
            <Route path='/movie/:movie' render={(props) => (test && <MovieInfo key={props.match.params.movie} imageErrorHandler={imageErrorHandler} validatedUser={validatedUser} resetNavbar={resetNavbar} setTest={setTest}/>)}/>
            <Route path='/all-results/:keyWord'>
              <AllResults imageErrorHandler={imageErrorHandler}/>
            </Route>
          </Suspense>
        </Switch>
      </div> }
    </Router>
  )
}

export default App;
