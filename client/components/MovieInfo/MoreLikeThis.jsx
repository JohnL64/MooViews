import React, { useEffect, useState} from 'react';
import css from '../../styles/MovieInfo.module.css';
import { AiFillStar, AiOutlineInfoCircle } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiFilmProjector } from 'react-icons/gi';

const MoreLikeThis = ({ id, collection, genres}) => {
  const [moreMovies, setMoreMovies] = useState(null);
  const [display, setDisplay] = useState({first: 0, last: 4})

  function getGenres() {
    // console.log('Genres LIST: ', genres)
    let genreIds = '';
    for (let i = 0; i < genres.length; i += 1) {
      genreIds += genres[i].id;
      if (i !== genres.length - 1 || genres[i + 1]) genreIds += ',';
    }
    return genreIds;
  }

  if (collection) collection = collection.id;
  if (genres.length > 0) genres = getGenres();
  else genres = null;
  // console.log('Collection id: ', collection);

  useEffect(() => {
    fetch(`/movie/more-movies?id=${id}&collection=${collection}&genres=${genres}`)
      .then(res => res.json())
      .then(data => {
        console.log('More like this!!!!!: ', data.moviesMoreLikeThis);
        setMoreMovies(data.moviesMoreLikeThis);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  function renderMoreMovies() {
    const similarMovies = [];
    for (let i = display.first; i <= display.last; i += 1) {
      const movie = moreMovies[i];
      similarMovies.push(
        <div className={css.similarMovie} key={movie.id}>
          <img src={movie.poster_path} />
          <p><AiFillStar /> {movie.vote_average}</p>
          <p>{movie.title}</p>
          <button><AiOutlineInfoCircle /></button>
        </div>
      )
    }
    return (
      <div className={css.moreMoviesContainer}>
        {similarMovies}
      </div>
    )
  }

  return ( 
    <div className={css.moreTitles}>
      <h2 className={css.moreTitle}>More like this</h2>
      { moreMovies &&  renderMoreMovies()}
    </div>
   );
}
 
export default MoreLikeThis;