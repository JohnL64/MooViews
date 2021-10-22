import React from 'react';
import css from '../../styles/Main.module.css';

const Main = ({ content }) => {

  // using variable and switch statement to dynamically render title for main content
  let mainTitle;
  switch(content) {
    case 'home': 
      mainTitle = 'Popular';
      break;
    case 'topRated': 
      mainTitle = 'Top Rated';
      break;
    case 'upcoming': 
      mainTitle = 'Coming Soon';
      break;
  }
  return ( 
    <div className={css.outerMain}>
      <h2>{mainTitle}</h2>
      <div className={css.innerMain}>

      </div>
    </div>
   );
}
 
export default Main;