import React from 'react';
import css from "../../styles/MovieInfo.module.css";
import { BsCircleFill } from 'react-icons/bs';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const MovieHeader = ({ movieInfo, validatedUser, userRating }) => {
  function createGenInfo() {
    let genInfoArr = [];
    function conditionalInfo(info) {
      if (info) {
        if (genInfoArr.length > 0) genInfoArr.push(<BsCircleFill key={`circle${genInfoArr.length}`} className={css.bullet}/>);
        genInfoArr.push(<span key={genInfoArr.length}>{info}</span>);
      }
    }
    conditionalInfo(movieInfo.rating);
    conditionalInfo(movieInfo.year);
    conditionalInfo(movieInfo.genres);
    conditionalInfo(movieInfo.runtime);
    return (
      <p className={css.genInfo}>
        {genInfoArr}
      </p>
    )
  }

  return ( 
    <div className={css.movieHeader}>
      <div className={css.titleAndInfo}>
        <h1 className={css.title}>{movieInfo.title}</h1>
        {createGenInfo()}
      </div>
      { (movieInfo.vote_count > 0 || typeof movieInfo.vote_count === 'string') && <div className={css.movieRating}>
        <div className={css.rating}>
          <p className={css.ratingTitle}>User Rating</p>
          <div className={css.userRating}>
            <AiFillStar className={css.starIcon}/>
            <div className={css.ratingAndCount}>
              <p><span>{movieInfo.vote_average}</span>/10</p>
              <p>{movieInfo.vote_count}</p>
            </div>
          </div>
        </div>
        <div className={css.rating}>
          <p className={css.ratingTitle}>Your Rating</p>
          { (!validatedUser || (validatedUser && userRating !== null)) && <div className={css.yourRating}>
            {/* Elements to dislplay when user is logged in and HAS rated movie */}
            { (validatedUser && userRating) && <AiFillStar className={css.rateIcon}/>}
            { (validatedUser && userRating) && <p id={css.dbRating}><span>{userRating}</span>/10</p>}
            {/* Elements to dislplay when user is not logged in OR has not rated movie */}
            { (!validatedUser || !userRating) && <AiOutlineStar className={css.rateIcon}/> }
            { (!validatedUser || !userRating) && <p>Rate</p> }
          </div> }
          {/* Element to display when querying db to see if user rated movie */}
          { (validatedUser && userRating === null) && <div className={css.ratingQuery}>
            <div className={css.queryAnimation}></div>
            <p>Rate</p>
          </div> }
        </div>
      </div> }
    </div>
   );
}
 
export default MovieHeader;

