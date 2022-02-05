import React from 'react';
import css from '../styles/Main.module.css';
import { Link } from 'react-router-dom';

const PageNavigator = ({ page, numOfPages, content }) => {
  page = Number(page);
  // If the container that is rendering PageNavigator is "Home" this function will ensure that certain elements will have a different class name so that the styling can be dynamically applied.
  function selectorName(name) {
    if (content) return css[name];
    return name;
  }

  const pageNumbers = [];
  let firstNum;
  let lastNum;

  function regBtn(pageNum) {
    return <Link to={`/popular/${pageNum}`} key={`pL${pageNum}`}><button className='pageNavBtn' key={pageNum} >{pageNum}</button></Link>
  };

  function currBtn(pageNum) {
    return <button className='pageNavBtn' id={selectorName('currPageNumber')} key={pageNum} >{pageNum}</button>
  };
  
  // Page number '1' will always be displayed and if current page is '1' the correct styling will be applied.
  if (page === 1) pageNumbers.push(currBtn(1));
  else pageNumbers.push(regBtn(1));
  // If number of total pages is less than 10 pages the only possible numbers to be included will be from 2 to the total pages minus 1. If the total number of pages is greater than 10 the numbers to be included are the numbers from the current page subtracted by 3 all the way up to the current page plus 3.
    if (page >= 6 && numOfPages >= 10)  pageNumbers.push(<span className='pageNavEllipsis' key='e1'>...</span>)
    if (page >= 6 && page < (numOfPages - 4))  {
      firstNum = page - 3;
      lastNum = page + 3;
    } else if (page < 6) {
      firstNum = 2;
      if (numOfPages < 10) lastNum = numOfPages - 1;
      else lastNum = 8;
    } else if (page > (numOfPages - 5)) {
      firstNum = numOfPages - 7;
      lastNum = numOfPages - 1;
    }

  // Pushing the three numbers before current page, the current page, and the three numbers after current page into pageNumbers array.
  for (let i = firstNum; i <= lastNum; i += 1) {
    if (i === page) pageNumbers.push(currBtn(i));
    else pageNumbers.push(regBtn(i));
  }

  // Will dynamically add ellipsis at the end of added numbers if conditions are met.
  if (numOfPages >= 10 && page <= (numOfPages - 5))  pageNumbers.push(<span className='pageNavEllipsis' key='e2'>...</span>);
  // If the total pages is greater than 1 the last page will be added to pageNumbersArray with the correct styling added.
  if (numOfPages > 1) {
    if (page === numOfPages) pageNumbers.push(currBtn(numOfPages));
    else pageNumbers.push(regBtn(numOfPages));
  }

  return (
    <div className={selectorName('pageNavigator')}> 

      <Link to={`/popular/${page - 1}`}><button disabled={page === 1} className={selectorName('pageNavNextPrev')} key='navPrevious' >Previous</button></Link>
      <div className="pageNumBtns">
        {pageNumbers}
      </div>
      <Link to={`/popular/${page + 1}`}><button disabled={page === numOfPages} className={selectorName('pageNavNextPrev')} key="navNext" >Next</button></Link>

    </div>
  );
}
 
export default PageNavigator;