import React from 'react';
import css from '../styles/Main.module.css';
import { Link } from 'react-router-dom';

const PageNavigator = ({ page, numOfPages, content }) => {
  page = Number(page);
  // If the container that is rendering PageNavigator is "Home" this function will ensure that certain elements will have a different class name so that the styling can be dynamically applied.
  function selectorName(name) {
    if (content === 'popular') return css[name];
    return name;
  }

  const pageNumbers = [];
  let firstNum;
  let lastNum;

  function regBtn(pageNum) {
    return <Link to={`/${content}/${pageNum}`} key={`pL${pageNum}`}><button className='pageNavBtn' key={pageNum} >{pageNum}</button></Link>
  };

  function currBtn(pageNum) {
    return <button className='pageNavBtn' id={selectorName('currPageNumber')} key={pageNum} >{pageNum}</button>
  };
  
  // Page number '1' will always be displayed and if current page is '1' the correct styling will be applied.
  if (page === 1) pageNumbers.push(currBtn(1));
  else pageNumbers.push(regBtn(1));

  // Only reassign firtNum and lastNum if the number of pages is greater than 2 because it there is less than 3 pages there is no need to additional number with our loop.
  if (numOfPages > 2) {
    // If the number of pages is less than 10 firstNum will always be 2 and lastNum will always be the number of pages minus one.
    if ( numOfPages < 10) {
      firstNum = 2;
      lastNum = (numOfPages - 1);
    } else {
      // Conditionally adds the ellipses to the beginning of page nav as long as the current page is greater than 5.
      if (page > 5)  pageNumbers.push(<span className='pageNavEllipsis' key='e1'>...</span>);
      // Up to this point we know number of pages is greater than 10 and if current page is less than 6 firstNum will always be 2 and lastNum will always be 8.
      if (page < 6) {
        firstNum = 2;
        lastNum = 8;
      // Up to this point we know number of pages is greater than 10 and page is greater than 5. So if the current page plus 3 is less than numOfPages firstNum will always be current page minus 3 and lastNum will always be current page plus 3.
      } else if ((page + 3) < numOfPages) {
        firstNum = (page - 3)
        lastNum = (page + 3);
      // We know total pages is greater than 10, page is greater than 5, and page plus 3 is greater than or equal to total number of pages. So firstNum will always be numOfPages minus 7 and lastNum will always be numOfPages minus 1.
      } else {
        firstNum = (numOfPages - 7);
        lastNum = (numOfPages - 1)
      }
    }
  }

  // If total number of pages exceeds 2 will add all number from firstNum to lastNum to be displayed on page nav.
  for (let i = firstNum; i <= lastNum; i += 1) {
    if (i === page) pageNumbers.push(currBtn(i));
    else pageNumbers.push(regBtn(i));
  }

  // Will dynamically add ellipsis at the end of added numbers if conditions are met.
  if (numOfPages > 9 && page < (numOfPages - 4))  pageNumbers.push(<span className='pageNavEllipsis' key='e2'>...</span>);
  // If the total pages is greater than 1 the last page will be added to pageNumbersArray with the correct styling added.
  if (numOfPages > 1) {
    if (page === numOfPages) pageNumbers.push(currBtn(numOfPages));
    else pageNumbers.push(regBtn(numOfPages));
  }

  return (
    <div className={selectorName('pageNavigator')}> 

      <Link to={`/${content}/${page - 1}`}><button disabled={page === 1} className={selectorName('pageNavNextPrev')} key='navPrevious' >Previous</button></Link>
      <div className="pageNumBtns">
        {pageNumbers}
      </div>
      <Link to={`/${content}/${page + 1}`}><button disabled={page === numOfPages} className={selectorName('pageNavNextPrev')} key="navNext" >Next</button></Link>

    </div>
  );
}
 
export default PageNavigator;