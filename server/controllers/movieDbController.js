const db = require('../model');

const movieDbController = {};

/*
-------- QUERIES TO SEE IF MOVIE EXIST IN DB --------
*/
movieDbController.dbMovieRating = (req, res, next) => {
  const { id } = req.query;
  const query = `
  SELECT rating, vote_count
  FROM movies
  WHERE movie_id = $1
  `;

  const values = [id];
  db.query(query, values, (err, ratedMovies) => {
    if (err) return next({ message: 'Error has occured at movieDbController.dbMovieRating'});
    if (ratedMovies.rows.length > 0) res.locals.dbRating = ratedMovies.rows[0];
    else console.log("Movie does not exist in DB")
    console.log('Movies found: ', ratedMovies.rows.length);
    return next();
  })
}


/*
Query example for when user rates movie and movie does not exist in DB

INSERT INTO movies(movie_id, rating, vote_count, custom_star, custom_count, eight_star)
VALUES (634649, 8.4, 2999, 8.4, 2998, 1)

*/

module.exports = movieDbController;