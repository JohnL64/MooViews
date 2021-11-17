import React, { useState, useEffect } from 'react';
import css from '../../styles/Preview.module.css';
import { IoClose } from 'react-icons/io5';

const MoviePreviewInfo = ({ close, movieToShowInfo, imageErrorHandler }) => {
  const { backdrop, releaseDate, id, title, overview } = movieToShowInfo;
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
  }, [])

  return (
    <div className={css.previewInfoBox} onClick={() => close(null)}>
      {error && <p>{error}</p>}
      { previewGeneralInfo &&
        <div className={css.previewInfoContent} onClick={(e) => e.stopPropagation()}>
            <IoClose className={css.previewClose} color='white' onClick={() => close(null)}/>
            <p className={css.previewInfoTitle}>{title}</p>
            <p className={css.allPreviewGeneralInfo}> 
              <span className={css.previewGeneralInfo}>{previewGeneralInfo.rating},</span> <span className={css.previewGeneralInfo}>{previewGeneralInfo.runtime},</span> <span className={css.previewGeneralInfo}>{releaseDate}</span> 
            </p>
            { !preInfoImageErrors[id] && <img className={css.backdropImg} src={backdrop} onError={(e) => imageErrorHandler(e, id, preInfoImageErrors, setPreInfoImageErrors)}/>}
            { preInfoImageErrors[id] && <div className={css.preInfoImageUnavailable}><p>Image is currently unavailable</p></div>}
            <p className={css.previewOverview}>{overview}</p>
        </div> }
    </div>
  )
}

export default MoviePreviewInfo;