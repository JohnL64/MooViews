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

  // dynamically renders the numbers to be displayed in page navigator depending on the current page a user is on
  function createPageNavigator(page, numOfPages, renderNewPage) {
    // new parameters
    // renderNewPage, page, numOfPages
    //page, numOfPages, renderNewPage
    const pageNumbers = [];
    pageNumbers.push(<button disabled={page === 1} className='pageNavNextPrev' key='navPrevious' onClick={() => renderNewPage(page - 1)}>Previous</button>);
    let firstNum;
    let lastNum;
    function regBtn(pageNum) {
      return <button className='pageNavBtn' key={pageNum} onClick={() => renderNewPage(pageNum)}>{pageNum}</button>
    };
    function currBtn(pageNum) {
      return <button className='pageNavBtn' id='currPageNumber' key={pageNum} onClick={() => renderNewPage(pageNum)}>{pageNum}</button>
    };
    if (page === 1) pageNumbers.push(currBtn(1));
    else pageNumbers.push(regBtn(1));

    if (numOfPages < 10) {
      firstNum = 2;
      lastNum = numOfPages - 1;
    } else {
      if (page >= 6)  pageNumbers.push(<span className='pageNavEllipsis' key='e1'>...</span>)
      if (page >= 6 && page < 26)  {
        firstNum = page - 3;
        lastNum = page + 3;
      } else if (page < 6) {
        firstNum = 2;
        lastNum = 8;
      } else if (page > 25) {
        firstNum = 23;
        lastNum = 29;
      }
    }

    for (let i = firstNum; i <= lastNum; i += 1) {
      if (i === page) pageNumbers.push(currBtn(i));
      else pageNumbers.push(regBtn(i));
    }

    if (numOfPages >= 10 && page < (numOfPages - 5))  pageNumbers.push(<span className='pageNavEllipsis' key='e2'>...</span>);
    if (page === numOfPages) pageNumbers.push(currBtn(numOfPages));
    else pageNumbers.push(regBtn(numOfPages));
    pageNumbers.push(<button disabled={page === numOfPages} className='pageNavNextPrev' key="navNext" onClick={() => renderNewPage(page + 1)}>Next</button>)
    return pageNumbers;
  }

  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Home imageErrorHandler={imageErrorHandler} createPageNavigator={createPageNavigator}/>
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
