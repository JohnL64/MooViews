import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";

const MovieInfo = () => {
  document.body.style.backgroundColor = 'black';
  const { movie } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);

  useEffect(() => {
    fetch(`/movie/movie-info?id=${movie}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }, []);
  return (
    <h2>Movie Id {movie}</h2>
  );
}
 
export default MovieInfo;