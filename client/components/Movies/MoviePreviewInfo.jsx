import React, { useState, useEffect } from 'react';
import css from '../../styles/Movies.module.css';
import { GrClose } from 'react-icons/gr';
import { BsDot } from 'react-icons/bs';

const MoviePreviewInfo = ({ backdrop, releaseDate, id, title, overview }) => {
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
    <div className={css.previewInfoBox}>
      { previewGeneralInfo &&
        <div className={css.previewInfoContent}>
          <span className={css.previewClose}>
            <GrClose />
            <p>{title}</p>
            <p>{previewGeneralInfo.rating}, {previewGeneralInfo.runtime},  {releaseDate}</p>
            <img className={css.backdropImg} src={backdrop}/>
            <p>{overview}</p>
          </span>
        </div> }
    </div>
  )
}

export default MoviePreviewInfo;