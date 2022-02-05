import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import css from '../../styles/Preview.module.css';
import { IoClose } from 'react-icons/io5';
import { GiFilmProjector } from 'react-icons/gi';

const MoviePreviewInfo = ({ close, movieToShowInfo, imageErrorHandler }) => {
  // disables scrolling when modal is open 
  document.body.style.overflow = 'hidden';
  const { backdrop, releaseDate, id, title, overview, genres } = movieToShowInfo;
  // using state to store general inforamtion of selected movie (data received from the server). After receiving the data state will be updated and will display the movie preview information.
  const [previewGeneralInfo, setPreviewGeneralInfo] = useState(null);
  const [error, setError] = useState(null);
  // using state to render a message when an error occurs trying to display an image for a movie. 
  const[preInfoImageErrors, setPreInfoImageErrors ] = useState({})

  useEffect(() => {
    fetch(`/movie/home?content=generalInfo&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status) throw new Error('Error', { cause: data.message });
        setPreviewGeneralInfo(data.generalInfo);
      })
      .catch(err => {
        console.log(err.cause)
        setError('An error has occured when loading general information for selected movie. Please try again or try again at a later time')
      })
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [])

  function addAvailableGeneralInfo() {
    const infoArr = [previewGeneralInfo.rating, releaseDate, genres, previewGeneralInfo.runtime];
    const infoToRender = [];
    for (let i = 0; i < infoArr.length; i += 1) {
      if (infoArr[i]) {
        infoToRender.push(<span key={`info${i}`}>{infoArr[i]}</span>);
        if (infoArr[i + 1]) infoToRender.push(<span key={`break${i}`}>|</span>);
      }
    }
    return infoToRender;
  }

  return (
    <div className={css.previewInfoBox} onClick={() => close(null)}>
      {error && <p>{error}</p>}
      { previewGeneralInfo &&
        <div className={css.previewInfoContent} onClick={(e) => e.stopPropagation()}>
            <IoClose className={css.previewClose} onClick={() => close(null)}/>
            <p className={css.previewInfoTitle}><Link to={`/movie/${id}`}>{title}</Link></p>
            <p className={css.allPreviewGeneralInfo}> 
              {addAvailableGeneralInfo()}
            </p>
            { !preInfoImageErrors[id] && <Link to={`/movie/${id}`} className={css.backdropLink}><img className={css.backdropImg} src={backdrop} onError={(e) => imageErrorHandler(e, id, preInfoImageErrors, setPreInfoImageErrors)}/></Link>}
            { preInfoImageErrors[id] && <Link to={`/movie/${id}`} className={css.backdropLink}><div className={css.preInfoImageUnavailable}><GiFilmProjector className={css.MPIfilmIcon} /></div></Link>}
            <p className={css.previewOverview}>{overview}</p>
        </div> }
    </div>
  )
}

export default MoviePreviewInfo;