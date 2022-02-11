import React, { useEffect, useState} from 'react';
import css from '../../styles/MovieInfo.module.css';
import { Link } from 'react-router-dom';
import { AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiFilmProjector } from 'react-icons/gi';
import MoreInfo from './MoreInfo.jsx';


const MoreLikeThis = ({ id, collection, genres, imageErrorHandler }) => {
  const [moreMovies, setMoreMovies] = useState(null);
  const [display, setDisplay] = useState({first: 0, last: 3})
  const [moreImageErrors, setMoreImageErrors] = useState({});
  const [moreInfo, setMoreInfo] = useState(null);

  function getGenres() {
    let genreIds = '';
    for (let i = 0; i < genres.length; i += 1) {
      if (i === 3) break;
      genreIds += genres[i].id;
      if (i !== genres.length - 1 || genres[i + 1]) genreIds += ',';
    }
    return genreIds;
  }

  if (collection) collection = collection.id;
  if (genres) genres = getGenres();
  else genres = null;

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/movie/more-movies?id=${id}&collection=${collection}&genres=${genres}`, { signal: abortCont.signal })
      .then(res => res.json())
      .then(data => {
        console.log('More like this!!!!!: ', data.moviesMoreLikeThis);
        setMoreMovies(data.moviesMoreLikeThis);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch Aborted in moreLikeThis!!!')
        }
        console.log(err);
      })
    return () => abortCont.abort();
  }, [])

  function changeRenderedMovies(direction) {
    const newDisplay = {};
    if (direction === 'right') {
      newDisplay.first = display.first + 4;
      newDisplay.last = display.last + 4;
    } else {
      newDisplay.first = display.first - 4;
      newDisplay.last = display.last - 4;
    }
    setDisplay(newDisplay);
  }

  function renderMoreMovies() {
    const similarMovies = [];
    for (let i = display.first; i <= display.last; i += 1) {
      const movie = moreMovies[i];
      similarMovies.push(
        <div className={css.similarMovie} key={movie.id}>
          { (movie.poster_path && !moreImageErrors[movie.id]) && <Link to={`/movie/${movie.id}`}><img src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, moreImageErrors, setMoreImageErrors)}/></Link>}
          { (!movie.poster_path || moreImageErrors[movie.id]) && <Link to={`/movie/${movie.id}`}><div className={css.moreImageUnavailable}><GiFilmProjector /></div></Link>}
          <div className={css.similarMovieInfo}>
            <p className={css.similarMovieRating}><AiFillStar /> {movie.vote_average}</p>
            <Link to={`/movie/${movie.id}`}><p className={css.similarMovieTitle}>{movie.title}</p></Link>
            <div><button onClick={() => setMoreInfo(movie)}><AiOutlineInfoCircle /></button></div>
          </div>
        </div>
      )
    }
    return (
      <div className={css.moreMoviesContainer}>
        { display.first !== 0 &&<div className={css.similarLeft} onClick={() => changeRenderedMovies('left')}><FaChevronLeft/></div> }
        {similarMovies}
        { display.first !== 12 &&<div className={css.similarRight} onClick={() => changeRenderedMovies('right')}><FaChevronRight/></div> }
      </div>
    )
  }

  return ( 
    <div className={css.moreLikeThis}>
      <h2 className={css.moreTitle}>More like this</h2>
      { moreMovies &&  renderMoreMovies()}
      { moreInfo && <MoreInfo moreInfo={moreInfo} setMoreInfo={setMoreInfo} imageErrorHandler={imageErrorHandler}/>}
    </div>
   );
}
 
export default MoreLikeThis;