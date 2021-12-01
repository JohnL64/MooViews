import React from 'react';
import { useParams } from "react-router";

const MovieInfo = () => {
  const { movie } = useParams();
  return (
    <h2>Movie Id {movie}</h2>
  );
}
 
export default MovieInfo;