import React, {useState, useEffect} from 'react';
import { useParams } from "react-router";
import css from "../styles/AllResults.module.css";
import { Link } from "react-router-dom";
import PageNavigator from '../components/PageNavigator.jsx';


const AllResults = ({ imageErrorHandler }) => {
  const { keyword } = useParams();
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState(null);

  useEffect(() => {
    fetch(`/movie/search?keyword=${keyword}&page=${page}&content=allResults`)
      .then(res => res.json())
      .then(data => {
        console.log('In All Results ', data);
        setAllResults(data.movies);
      })
      .catch(err => {
        console.log(err);
      })
  }, [page]);

  function renderNewPage(newPageNum) {
    setAllResults(null);
    setPage(newPageNum);
  }

  return ( 
    <div className={css.allResults}>
      { allResults && 
        <div className={css.innerAllResults}>
          <h3>All results for "{keyword}"</h3>
          {allResults.map(movie => {
            return (
              <div className={css.movie} key={movie.id}>
                <Link to={`/movie/${movie.id}`}><img className={css.image}src={movie.poster_path}/></Link>
                <div className={css.movieInfo}>
                  <p>
                    <span><Link to={`/movie/${movie.id}`}>{movie.title}</Link></span>
                    <span>|</span>
                    <span>({movie.release_date})</span>
                  </p>
                  <p className={css.overview}>{movie.overview}</p>
                </div>
              </div>
            )
          })}
          {/* page, numOfPages, renderNewPage, content */}
          <PageNavigator page={page} numOfPages={20} renderNewPage={renderNewPage}/>
        </div>
      }
    </div>
   );
}
 
export default AllResults;