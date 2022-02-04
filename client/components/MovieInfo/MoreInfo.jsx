import React, { useState, useEffect } from 'react';
import css from '../../styles/MovieInfo.module.css';
import { Link } from 'react-router-dom';
import { GiFilmProjector } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { BsCircleFill } from 'react-icons/bs';

const MoreInfo = ({ moreInfo, setMoreInfo, imageErrorHandler }) => {
  document.body.style.overflow = 'hidden';

  const [movieInfo, setMovieInfo] = useState(null);
  const [moreIimageErrors, setMoreIimageErrors] = useState({});
  const { id, title, overview, poster_path} = moreInfo;

  useEffect(() => {
    fetch(`/movie/more-info?id=${id}`)
    .then(res => res.json())
    .then(data => {
      console.log('More MOVIE INFO!!!!!: ', data.movieInfo);
      setMovieInfo(data.movieInfo);
    })
    .catch(err => {
      console.log(err);
    })
    return function enableScrolling() {
      document.body.style.overflow = 'auto';
    }
  }, [])

  function renderGeneralInfo() {
    const infoArr = [movieInfo.year, movieInfo.runtime, movieInfo.rating];
    const renderInfo = [];
    for (let i = 0; i < infoArr.length; i += 1) {
      if (infoArr[i]) renderInfo.push(<span key={`info${i}`}>{infoArr[i]}</span>);
      if (infoArr[i + 1]) renderInfo.push(<BsCircleFill key={`bs${i}`}/>);
    }
    return renderInfo;
  }

  function getGenres() {
    const genres = [];
    for (const genre of movieInfo.genres) {
      if (genres.length === 5) break;
      if (genre.name === 'Science Fiction') genre.name = 'Sci-Fi'
      genres.push(<p key={genre.id}>{genre.name}</p>)
    }
    return genres;
  }

  function getCredits(title, creditArr) {
    const credits = [];
    if (title === "Director" && creditArr.length > 1) title += 's';
    for (let i = 0; i < creditArr.length; i += 1) {
      let person = creditArr[i];
      if (title === 'Cast') person = creditArr[i].name;
      credits.push(<span key={person}>{person}</span>)
      if (creditArr[i + 1]) credits.push(<BsCircleFill key={`circle${i}`}/>)
    }
    if (creditArr.length > 0) {
      return (
        <p className={css.moreCredits}>{title} {credits}</p>
      )
    }
  }

  return ( 
    <div className={css.moreInfo} onClick={() => setMoreInfo(null)}>
      <div className={css.moreInfoContent} onClick={e => e.stopPropagation()}>
        <IoClose className={css.closeMoreInfo} onClick={() => setMoreInfo(null)}/> 
        { (poster_path && !moreIimageErrors.hasOwnProperty(id)) && <Link to={`/movie/${id}`}><img src={poster_path} onError={(e) => imageErrorHandler(e, id, moreIimageErrors, setMoreIimageErrors)}/></Link>}
        { (!poster_path || moreIimageErrors.hasOwnProperty(id)) &&  <Link to={`/movie/${id}`}><div className={css.moreIunavailableImg}><GiFilmProjector /></div></Link>}
        <div className={css.moreInfoBox}>
          <Link to={`/movie/${id}`} className={css.moreTitleLink}><p className={css.moreInfoTitle}>{title}</p></Link>
          { movieInfo && <div>
            <p className={css.moreGenInfo}>{renderGeneralInfo()}</p>
            <div className={css.moreGenres}>{getGenres()}</div>
            <p className={css.moreOverview}>{ overview ? overview : 'The plot is currently unknown.' }</p>
            {getCredits('Director', movieInfo.credits.updatedCrew.Director)}
            {getCredits('Cast', movieInfo.credits.updatedCast)}
          </div> }
          { !movieInfo && <div className={css.loadingMoreInfo} onClick={e => e.stopPropagation()}>
            <div className="loadingDots">
              <div id={css.moreLoading}></div>
              <div id={css.moreLoading}></div>
              <div id={css.moreLoading}></div>
            </div>
          </div>}
        </div>
      </div>
    </div>
   );
}
 
export default MoreInfo;