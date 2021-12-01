import React, {useState, useEffect} from 'react';
import { useParams } from "react-router";

const AllResults = () => {
  const { keyword } = useParams();

  return ( 
    <div>
      Keyword: {keyword}
    </div>
   );
}
 
export default AllResults;