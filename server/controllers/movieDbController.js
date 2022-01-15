const db = require('../model');

function getCurrentDate() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  let year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

const movieDbController = {};

/*
-------- QUERIES TO SEE IF MOVIE EXIST IN DB --------
*/
movieDbController.dbMovieRating = (req, res, next) => {
  const { id } = req.query;
  const query = `
  SELECT *
  FROM movies
  WHERE movie_id = $1;
  `;

  const values = [id];
  db.query(query, values, (err, ratedMovies) => {
    if (err) return next({ message: 'Error has occured at movieDbController.dbMovieRating'});
    if (ratedMovies.rows.length > 0) res.locals.dbRating = ratedMovies.rows[0];
    else  res.locals.dbRating = null;
    return next();
  })
}


/*
-------- QUERIES DB TO SEE IF USER RATED A MOVIE --------
*/
movieDbController.getUserMovieRating = (req, res, next) => {
  const { id } = req.query;
  let user;
  if (req.isAuthenticated()) user = req.user._id;
  else {
    res.locals.notVerified = true;
    return next();
  }

  const query = `
  SELECT rating
  FROM reviews
  WHERE movie_id = $1 AND user_id = $2;
  `;

  const values = [id, user];

  db.query(query, values, (err, userReview) => {
    if (err) return next({ message: 'Error has occured when querying database in movieDbController.getUserMovieRating' });
    if (userReview.rows.length > 0) res.locals.userRating = userReview.rows[0].rating;
    else res.locals.userRating = false;
    return next();
  })
}


/*
-------- ADDS USER REVIEW OR RATING TO ALL REVIEWS AND UPDATES MOVIE'S TOTAL RATING --------
*/
movieDbController.addUserMovieRating = (req, res, next) => {
  const { id, rating } = req.body;

  if (req.isAuthenticated()) {
    const date = getCurrentDate();
    const query = `
    INSERT INTO  reviews(movie_id, user_id, username, date, rating)
    VALUES ($1, $2, $3, $4, $5);
    `;

    const values = [id, req.user._id, req.user.username, date, rating];

    db.query(query, values, (err, addedReview) => {
      if (err) return next({ message: 'Error has occured when adding review in movieDbController.addUserMovieRating' });
      res.locals.msg = 'User review has been added.';
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


movieDbController.updateUserMovieRating  = (req, res, next) => {
  const { id, rating } = req.body;

  if (req.isAuthenticated()) {
    const query = `
    UPDATE reviews
    SET rating = $1
    WHERE movie_id = $2 AND user_id = $3;
    `;

    const values = [rating, id, req.user._id];

    db.query(query, values, (err, updatedReview) => {
      if (err) return next({ message: 'Error has occured when adding review in movieDbController.addUserMovieRating' });
      res.locals.msg = 'User review has been updated.';
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


/*
-------- ADDS MOVIE TO DATABASE WITH EXISTING USER REVIEWS --------
*/
movieDbController.addMovie = (req, res, next) => {
  const { id, rating, tmdb_vote_count, vote_average } = req.body;

  if (req.isAuthenticated()) {
    const totalRating = ((vote_average * tmdb_vote_count) + rating) / (tmdb_vote_count + 1);
    const fixedRating = Number(totalRating.toFixed(1));
    const voteCount = tmdb_vote_count + 1;
    const query = `
    INSERT INTO movies(movie_id, rating, vote_count, custom_star, custom_count, star_${rating})
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `
    const values = [id, fixedRating, voteCount, vote_average, tmdb_vote_count, 1];

    db.query(query, values, (err, addedMovie) => {
      if (err) return next({ message: 'Error has occured when adding movie in movieDbController.addMovie' });
      addedMovie.rows[0].rating = Number(addedMovie.rows[0].rating);
      res.locals.addedDbRating = addedMovie.rows[0];
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


/*
-------- UPDATES MOVIE IN DATABASE WITH NEW USER RATING --------
*/
movieDbController.updateMovie = (req, res, next) => {
  const { dbRating, id, rating } = req.body;
  let previousUserRating = req.body.previousUserRating;

  function getAverage(dbObj) {
    let sum = dbObj.custom_count * dbObj.custom_star;
    let votes = dbObj.custom_count;
    for (let i = 1; i <= 10; i += 1) {
      if (dbObj[`star_${i}`] > 0) {
        sum += i * dbObj[`star_${i}`];
        votes += dbObj[`star_${i}`];
      }
    } 
    return Number((sum / votes).toFixed(1));
  }

  if (req.isAuthenticated()) {
    dbRating[`star_${rating}`] += 1;
    if (!previousUserRating) {
      if (rating === 10) previousUserRating = rating - 1;
      else previousUserRating = rating + 1;
      dbRating.vote_count += 1;
    }
    else {
      dbRating[`star_${previousUserRating}`] -= 1;
    }
    dbRating.rating = getAverage(dbRating);
    const query = `
    UPDATE movies
    SET rating = $1,
        vote_count = $2,
        star_${rating} = $3,
        star_${previousUserRating} = $4
    WHERE movie_id = $5
    RETURNING *;
    `
    const values = [dbRating.rating, dbRating.vote_count, dbRating[`star_${rating}`], dbRating[`star_${previousUserRating}`], id];

    db.query(query, values, (err, updatedMovie) => {
      if (err) return next({ message: 'Error has occured when updating movie in movieDbController.updateMovie' });
      updatedMovie.rows[0].rating = Number(updatedMovie.rows[0].rating);
      res.locals.updatedDbRating = updatedMovie.rows[0];
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


module.exports = movieDbController;