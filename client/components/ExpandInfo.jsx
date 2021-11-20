import React, { useState, useEffect } from 'react';
import css from '../styles/ComingSoon.module.css';

const ExpandInfo = ({ id }) => {
  const [expandInfo, setExpandInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  let infoAction = 'Expand';
  if (showInfo) infoAction = 'Collapse';

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
        <p>Rating: {expandInfo.MPAA_rating}</p>
        <p>Runtime: {expandInfo.runtime}</p>
        <p>Cast: {expandInfo.credits.topCast}</p>
        <p>{expandInfo.credits.directorTitle + ': ' + expandInfo.credits.director}</p>
      </div>
    )
  }

  return ( 
  <div className={css.expandInfo}>
    {showInfo && createExpandInfo()}
    <button onClick={expandInfoAction}>{infoAction}</button>
  </div>
  );
}
 
export default ExpandInfo;