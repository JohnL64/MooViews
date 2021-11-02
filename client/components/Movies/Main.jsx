import React, { useState } from 'react';
import css from '../../styles/Main.module.css';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

const Main = ({ main, setMain, setPreview, content, page, setPage, imageErrorHandler }) => {
  // using state to render a message when an error occurs trying to display an image for a movie. 
  const [mainImageErrors, setMainImageErrors] = useState({});
  const mainContent = [];
  // creating movie to be displayed 
  function mainMovie(movie) {
    return (
      <div className={css.mainMovie} key={movie.id}>
        { !mainImageErrors[movie.id] && <Link to={`/movie-info/${movie.id}`}> <img className={css.mainImage} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, mainImageErrors, setMainImageErrors)}/> </Link>}
        { mainImageErrors[movie.id] && <div className={css.mainImageUnavailable}><p>Image is currently unavailable</p></div>}
        {/* <Link to={`/movie-info/${movie.id}`}> <img className={css.mainImage} src={movie.poster_path}/> </Link> */}
        <div className={css.mainMovieInfo}>
          <p className={css.mainMovieTitle}><Link className={css.mainTitleLink} to={`/movie-info/${movie.id}`}>{movie.title} </Link></p>
          <p className={css.allGeneralMovieInfo}> 
            <span className={css.genInfo}>{movie.MPAA_rating},</span> 
            <span className={css.genInfo}>{movie.runtime},</span> 
            <span className={css.genInfo}>{movie.release_date},</span> 
            <span className={css.genInfo}>{movie.genres}</span>
          </p>
          <p className={css.movieMainRating}><AiFillStar className={css.starRating} color='pink'/>{movie.vote_average}</p>
          <p className={css.mainOverview}>{movie.overview}</p>
          <p className={css.fullDetails}><Link className={css.fullDetailsLink} to={`/movie-info/${movie.id}`}>See full details</Link></p>
        </div>
      </div>
    )
  }

  // creating rows of movies to be rendered for Main. Each row includes two movies
  if (main) {
    for (let i = 0; i < main.length; i += 2) {
      let row = [];
      row.push(mainMovie(main[i]));
      row.push(mainMovie(main[i + 1]));
      mainContent.push(
        <div className={css.mainMovieRow} key={i}>
          {row}
        </div>
      );
    }
  }

  //creates an empty movie box to be displayed when main content is being fetched from server
  function loadingMainMovieBox () {
    return (
      <div className={css.loadingMainMovieBox}>
        <div className={css.loadingDots}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  // using variable and switch statement to dynamically render title for main content
  let mainTitle;
  switch(content) {
    case 'home': 
      mainTitle = 'Most Popular';
      break;
    case 'topRated': 
      mainTitle = 'Top Rated';
      break;
    case 'upcoming': 
      mainTitle = 'Coming Soon';
      break;
  }

  // changes state for preview, main, and page when a number is clicked in page navigator
  function renderNewPage(pageNum) {
    setPreview(null)
    setMain(null);
    setPage(pageNum);
  }

  // dynamically renders the numbers to be displayed in page navigator depending on the current page a user is on
  function createPageNavigator() {
    const pageNumbers = [];

    let firstNum;
    let lastNum;
    function regBtn(pageNum) {
      return <button className={css.pageNavBtn} key={pageNum} onClick={() => renderNewPage(pageNum)}>{pageNum}</button>
    };
    function currBtn(pageNum) {
      return <button className={css.pageNavBtn} id={css.currPageNumber} key={pageNum} onClick={() => renderNewPage(pageNum)}>{pageNum}</button>
    };
    if (page === 1) pageNumbers.push(currBtn(1));
    else pageNumbers.push(regBtn(1));
    if (page >= 6)  pageNumbers.push(<span className={css.pageNavEllipsis} key='e1'>...</span>)
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
    for (let i = firstNum; i <= lastNum; i += 1) {
      if (i === page) pageNumbers.push(currBtn(i));
      else pageNumbers.push(regBtn(i));
    }
    if (page < 25)  pageNumbers.push(<span className={css.pageNavEllipsis} key='e2'>...</span>);
    if (page === 30) pageNumbers.push(currBtn(30));
    else pageNumbers.push(regBtn(30));
    return pageNumbers;
  }

  return (
    <div className={css.outerMain}>
      <h2>{mainTitle}</h2>
      <div className={css.innerMain}>
        {!main && 
          <div className={css.loadingMainMovieRow}>
            {loadingMainMovieBox()}
            {loadingMainMovieBox()}
          </div> }
        { main && mainContent }
      </div>
      {main &&
        <div className={css.pageNavigator}>
          <button disabled={page === 1} className={css.pageNavNextPrev} onClick={() => renderNewPage(page - 1)}>Previous</button>
          {createPageNavigator()}
          <button disabled={page === 30} className={css.pageNavNextPrev} onClick={() => renderNewPage(page + 1)}>Next</button>
        </div> }
    </div>
   );
}
 
export default Main;