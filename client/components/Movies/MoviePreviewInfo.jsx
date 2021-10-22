import React, { useState, useEffect } from 'react';
import css from '../../styles/Movies.module.css';
import { IoClose } from 'react-icons/io5';

const MoviePreviewInfo = ({ close, backdrop, releaseDate, id, title, overview }) => {
  const [previewGeneralInfo, setPreviewGeneralInfo] = useState(null);
  useEffect(() => {
    fetch(`/movie/content?content=generalInfo&id=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.generalInfo.rating);
        setPreviewGeneralInfo(data.generalInfo);
      })
  }, [])

  return (
    <div className={css.previewInfoBox} onClick={() => close(null)}>
      { previewGeneralInfo &&
        <div className={css.previewInfoContent} onClick={(e) => e.stopPropagation()}>
          <span className={css.previewClose} onClick={() => close(null)}> 
            <IoClose size='27px' color='white'/>
          </span>
            <p className={css.previewInfoTitle}>{title}</p>
            <p className={css.allPreviewGeneralInfo}> <span className={css.previewGeneralInfo}>{previewGeneralInfo.rating},</span> <span className={css.previewGeneralInfo}>{previewGeneralInfo.runtime},</span> <span className={css.previewGeneralInfo}>{releaseDate}</span> </p>
            <img className={css.backdropImg} src={backdrop}/>
            <p className={css.previewOverview}>{overview}</p>
        </div> }
    </div>
  )
}

export default MoviePreviewInfo;