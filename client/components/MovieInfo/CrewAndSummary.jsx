import React from 'react';
import css from '../../styles/MovieInfo.module.css';
import { BsCircleFill } from 'react-icons/bs';

const CrewAndSummary = ({ updatedCrew, overview, video }) => {
  let creditedCrew = updatedCrew.Director.length + updatedCrew.Writer.length + updatedCrew.Producer.length;
  function classNameRender() {
    if (video === false) return css.crewAndSummaryNoVideo;
    else return css.crewAndSummary;
  }

  function getCrew(jobArr, jobTitle) {
    const peopleArr = [];
    if (jobArr.length > 1) jobTitle += 's';
    peopleArr.push(<span key={jobTitle}>{jobTitle}</span>)
    for (let i = 0; i < jobArr.length; i += 1) {
      // Adds a maximum of 3 people for each job title.
      if (i === 3) break;
      peopleArr.push(<span key={jobArr[i]}>{ jobArr[i]}</span>);
      if (i < jobArr.length - 1 && i < 2) peopleArr.push(<BsCircleFill className={css.bullet} key={i}/>)
    }
    return peopleArr;
  }

  return (
    <div className={classNameRender()}>
      <p>{overview}</p>
      { updatedCrew.Director.length > 0 && <p>{getCrew(updatedCrew.Director, 'Director')}</p>}
      { updatedCrew.Writer.length > 0 && <p>{getCrew(updatedCrew.Writer, 'Writer')}</p>}
      { updatedCrew.Producer.length > 0 && <p>{getCrew(updatedCrew.Producer, 'Producer')}</p>}
      { creditedCrew < 1 && <p key='none credited'>Information about the crew has yet to be added.</p>}
    </div> 
  )
}

export default CrewAndSummary;