import React, {useState, useEffect} from 'react';
import { useParams } from "react-router";
import css from "../styles/AllResults.module.css";

const AllResults = () => {
  const { keyword } = useParams();

  return ( 
    <div className={css.AllResults}>
      
    </div>
   );
}
 
export default AllResults;