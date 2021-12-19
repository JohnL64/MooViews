import React, {useState, useEffect} from 'react';
import { useParams } from "react-router";
import css from "../styles/AllResults.module.css";
import { Link } from "react-router-dom";
import PageNavigator from '../components/PageNavigator.jsx';
import { GiFilmProjector } from 'react-icons/gi';


const AllResults = ({ imageErrorHandler }) => {
  document.body.style.backgroundColor = 'white';
  const { keyWord } = useParams();
  const [keyword, setKeyword] = useState(keyWord);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(0)
  const [allResults, setAllResults] = useState(null);
  const [ARimageErrors, setARimageErrors] = useState({});

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(`/movie/search?keyword=${keyword}&page=${page}&content=allResults`, { signal: abortCont.signal})
      .then(res => res.json())
      .then(data => {
        console.log('In All Results ', data);
        setNumOfPages(data.numOfPages)
        setAllResults(data.movies);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch Aborted')
        }
        console.log(err);
      })

    return () => abortCont.abort();
  }, [page]);

  function renderNewPage(newPageNum) {
    setAllResults(null);
    setPage(newPageNum);
  }

  return ( 
    <div className={css.allResults}>
      { allResults && 
        <div className={css.innerAllResults}>
          <h3 className={css.resultsTitle}>Showing results for <span>"{keyword}"</span></h3>
          {allResults.map(movie => {
            return (
              <div className={css.ARmovie} key={movie.id}>
                { 
                  (movie.poster_path && !ARimageErrors[movie.id]) &&  
                  <Link to={`/movie/${movie.id}`}><img className={css.image} src={movie.poster_path} onError={(e) => imageErrorHandler(e, movie.id, ARimageErrors, setARimageErrors)}/></Link> 
                }
                {
                  (!movie.poster_path || ARimageErrors[movie.id]) &&
                  <div className={css.ARimageUnavailable}>
                    <GiFilmProjector className={css.filmIcon} />
                  </div>
                }
                {/* <Link to={`/movie/${movie.id}`}><img className={css.image}src={movie.poster_path}/></Link> */}
                <div className={css.movieInfo}>
                  <div className={css.titleYear}>
                    <p className={css.title}><Link to={`/movie/${movie.id}`} className={css.titleLink}>{movie.title}</Link></p> 
                    <p className={css.year}>({movie.release_date})</p>
                  </div>
                  <p className={css.overview}>{movie.overview}</p>
                </div>
              </div>
            )
          })}
          <PageNavigator page={page} numOfPages={numOfPages} renderNewPage={renderNewPage}/>
        </div> }
    </div>
   );
}
 
export default AllResults;