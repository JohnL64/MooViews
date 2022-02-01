const { IoCompassSharp } = require('react-icons/io5');
const db = require('../model');

function getCurrentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
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
    if (err) return next({ message: 'Error has occured querying for movie rating in database in movieDbController.dbMovieRatingAndReview'});
    if (ratedMovies.rows.length > 0) {
      res.locals.dbRating = ratedMovies.rows[0];
    }
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
  SELECT _id, username, TO_CHAR(date :: DATE, 'Mon dd, yyyy') AS date, review, headline, user_rating
  FROM reviews
  WHERE movie_id = $1 AND user_id = $2;
  `;

  const values = [id, user];

  db.query(query, values, (err, userReview) => {
    if (err) return next({ message: 'Error has occured when querying database in movieDbController.getUserMovieRating' });
    if (userReview.rows.length > 0) res.locals.userRating = userReview.rows[0];
    else res.locals.userRating = false;
    return next();
  })
}


/*
-------- ADDS USER REVIEW OR ONLY RATING TO REVIEWS IN DATABSE --------
*/
movieDbController.addUserMovieRating = (req, res, next) => {
  const { id, rating, headline, review } = req.body;

  if (req.isAuthenticated()) {
    const date = getCurrentDate();
    const query = `
    INSERT INTO  reviews(movie_id, user_id, username, date, user_rating, headline, review)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `;

    const values = [id, req.user._id, req.user.username, date, rating, headline, review];

    db.query(query, values, (err, addedRating) => {
      if (err) return next({ message: 'Error has occured when adding review in movieDbController.addUserMovieRating' });
      if (addedRating.rows.length > 0) res.locals.userRating = addedRating.rows[0];
      else res.locals.userRating = null;
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


/*
-------- UPDATES USER REVIEW OR ONLY RATING TO REVIEWS IN DATABASE --------
*/
movieDbController.updateUserMovieRating  = (req, res, next) => {
  const { id, rating, headline, review } = req.body;

  if (req.isAuthenticated()) {
    const query = `
    UPDATE reviews
    SET user_rating = $1, headline = $2, review = $3
    WHERE movie_id = $4 AND user_id = $5
    RETURNING *
    `;

    const values = [rating, headline, review, id, req.user._id];

    db.query(query, values, (err, updatedRating) => {
      if (err) return next({ message: 'Error has occured when adding review in movieDbController.addUserMovieRating' });
      if (updatedRating.rows.length > 0) res.locals.userRating = updatedRating.rows[0];
      else res.locals.userRating = null;
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
  const { id, rating, tmdb_vote_count, vote_average, ratingOrReview } = req.body;

  if (req.isAuthenticated()) {
    const totalRating = ((vote_average * tmdb_vote_count) + rating) / (tmdb_vote_count + 1);
    const fixedRating = Number(totalRating.toFixed(1));
    const voteCount = tmdb_vote_count + 1;
    let reviewCount = 0;
    if (ratingOrReview === 'review') reviewCount += 1;
    const query = `
    INSERT INTO movies(movie_id, rating, vote_count, custom_star, custom_count, star_${rating}, review_count)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `
    const values = [id, fixedRating, voteCount, vote_average, tmdb_vote_count, 1, reviewCount];

    db.query(query, values, (err, addedMovie) => {
      if (err) return next({ message: 'Error has occured when adding movie in movieDbController.addMovie' });
      addedMovie.rows[0].rating = Number(addedMovie.rows[0].rating);
      res.locals.newDbRating = addedMovie.rows[0];
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
  const { dbRating, id, rating, previousUserReview, ratingOrReview } = req.body;
  let previousUserRating = req.body.previousUserRating;
  console.log('In UPDATE MOVIE: ', previousUserReview, ratingOrReview, !previousUserReview && ratingOrReview === 'review');

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
    if(ratingOrReview === 'rating' || rating !== previousUserRating) dbRating[`star_${rating}`] += 1;
    // If user has never rated existing movie previousUserRating is assigned an arbitrary rating to ensure database query does not cause an error. The value of this arbitrary rating's count will not change in the database. Also the vote_count property must be incremented only when this is the user first time rating movie.
    if (!previousUserRating || (ratingOrReview === 'review' && rating === previousUserRating)) {
      if (rating === 10) previousUserRating = rating - 1;
      else previousUserRating = rating + 1;
      dbRating.vote_count += 1;
    }
    else {
      dbRating[`star_${previousUserRating}`] -= 1;
    }
    dbRating.rating = getAverage(dbRating);
    console.log('OVERALL RATING: ', dbRating.rating);
    if (!previousUserReview && ratingOrReview === 'review') {
      console.log('INCREMENTING REVIEW COUNT BY ONE');
      dbRating.review_count += 1; 
    }

    const query = `
    UPDATE movies
    SET rating = $1,
        vote_count = $2,
        star_${rating} = $3,
        star_${previousUserRating} = $4,
        review_count = $5
    WHERE movie_id = $6
    RETURNING *;
    `
    const values = [dbRating.rating, dbRating.vote_count, dbRating[`star_${rating}`], dbRating[`star_${previousUserRating}`],  dbRating.review_count, id];
    console.log(dbRating.rating, dbRating.vote_count, dbRating[`star_${rating}`], dbRating[`star_${previousUserRating}`],  dbRating.review_count, id);

    db.query(query, values, (err, updatedMovie) => {
      if (err) {
        console.log('Error occured when making query in update movie');
        console.log(err);
        return next({ message: 'Error has occured when updating movie in movieDbController.updateMovie' });
      }
      updatedMovie.rows[0].rating = Number(updatedMovie.rows[0].rating);
      console.log("AFTER QUERY IN UPDATE MOVIE: ", updatedMovie.rows[0]);
      res.locals.newDbRating = updatedMovie.rows[0];
      return next();
    })
  }
  else {
    res.locals.notVerified = true;
    return next();
  }
}


/*
-------- GETS USER REVIEWS FROM DATABASE FOR CURRENT MOVIE --------
*/
movieDbController.getUserReviews = (req, res, next) => {
  const { id, limit, reviewsShown } = req.query;

  const query = `
  SELECT _id, username, TO_CHAR(date :: DATE, 'Mon dd, yyyy') AS date, review, headline, user_rating
  FROM reviews
  WHERE movie_id = $1 AND review IS NOT NULL
  ORDER BY date DESC, _id DESC
  LIMIT $2
  OFFSET $3;
  `;

  const values = [id, limit, reviewsShown];

  db.query(query, values, (err, reviewsToDisplay) => {
    if (err) return next({message: 'Error has occured when retreiving reviews in movieDbController.getUserReviews'});
    if (reviewsToDisplay.rows.length > 0) res.locals.reviewsToDisplay = reviewsToDisplay.rows;
    else res.locals.reviewsToDisplay = null;
    return next(); 
  })
}

module.exports = movieDbController;