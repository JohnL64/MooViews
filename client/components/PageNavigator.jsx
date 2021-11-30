import React from 'react';
import css from '../styles/Main.module.css';

const PageNavigator = ({ page, numOfPages, renderNewPage, content }) => {
  function selectorName(name) {
    if (content) return css[name];
    return name;
  }

  const pageNumbers = [];
  let firstNum;
  let lastNum;

  function regBtn(pageNum) {
    return <button className='pageNavBtn' key={pageNum} onClick={() => renderNewPage(pageNum)}>{pageNum}</button>
  };

  function currBtn(pageNum) {
    return <button className='pageNavBtn' id={selectorName('currPageNumber')} key={pageNum} >{pageNum}</button>
  };
  
  if (page === 1) pageNumbers.push(currBtn(1));
  else pageNumbers.push(regBtn(1));

  if (numOfPages < 10) {
    firstNum = 2;
    lastNum = numOfPages - 1;
  } else {
    if (page >= 6)  pageNumbers.push(<span className='pageNavEllipsis' key='e1'>...</span>)
    if (page >= 6 && page < 26)  {
      firstNum = page - 3;
      lastNum = page + 3;
    } else if (page < 6) {
      firstNum = 2;
      lastNum = 8;
    } else if (page > 25) {
      firstNum = 23;
      lastNum = 29;
    }
  }

  for (let i = firstNum; i <= lastNum; i += 1) {
    if (i === page) pageNumbers.push(currBtn(i));
    else pageNumbers.push(regBtn(i));
  }

  if (numOfPages >= 10 && page < (numOfPages - 5))  pageNumbers.push(<span className='pageNavEllipsis' key='e2'>...</span>);
  if (page === numOfPages) pageNumbers.push(currBtn(numOfPages));
  else pageNumbers.push(regBtn(numOfPages));

  return (
    <div className={selectorName('pageNavigator')}> 
      <button disabled={page === 1} className={selectorName('pageNavNextPrev')} key='navPrevious' onClick={() => renderNewPage(page - 1)}>Previous</button>
      <div className="pageNumBtns">
        {pageNumbers}
      </div>
      <button disabled={page === numOfPages} className={selectorName('pageNavNextPrev')} key="navNext" onClick={() => renderNewPage(page + 1)}>Next</button>
    </div>
  );
}
 
export default PageNavigator;