import React, { useState, useEffect } from 'react';
import css from '../styles/TopRated.module.css';

const TopRated = () => {
  const [topRated, setTopRated] = useState(null);

  useEffect(() => {
    fetch('/movie/top-rated')
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }, [])
  
  return ( 
    <div className={css.topRated}>
      <h2>Top Rated</h2>
    </div>
   );
}
 
export default TopRated;