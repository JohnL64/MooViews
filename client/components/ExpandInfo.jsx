import React, { useState, useEffect } from 'react';
import css from '../styles/ComingSoon.module.css';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

const ExpandInfo = ({ id }) => {
  const [expandInfo, setExpandInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  let infoAction = 'More Info';
  let infoIcon = <AiFillCaretDown className={css.arrows} />
  if (showInfo) {
    infoAction = 'Hide Info';
    infoIcon = <AiFillCaretUp className={css.arrows} />
  }

  function expandInfoAction() {
    if (!expandInfo) {
    fetch(`/movie/coming-soon?content=expandInfo&id=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setExpandInfo(data.expandInfo);
        setShowInfo(true);
      })
    } else if (!showInfo) {
      setShowInfo(true);
    } else setShowInfo(false);
}

  function createExpandInfo() {
    return (
      <div className={css.innerExpandInfo}>
        <p>
          <span className={css.infoLabel}>{expandInfo.credits.directorTitle + ': '}</span> {expandInfo.credits.director}
        </p>
        <p><span>Cast:</span> {expandInfo.credits.topCast}</p>
        <p><span>Rating:</span> {expandInfo.MPAA_rating}</p>
        <p><span>Runtime:</span> {expandInfo.runtime}</p>
      </div>
    )
  }

  return ( 
  <div className={css.expandInfo}>
    {showInfo && createExpandInfo()}
    <div className={css.outerActionBtn}>
      <button className={css.actionBtn} onClick={expandInfoAction}>
        <span className={css.actionText}>{infoAction}</span>
        {infoIcon}
      </button>
    </div>
  </div>
  );
}
 
export default ExpandInfo;