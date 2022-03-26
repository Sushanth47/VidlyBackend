const express = require("express");
const {
  getMovies,
  createMovies,
  requestedMovie,
  addToCart,
  getMoviesSort,
  createMoviesPage,
  displayMovie,
  getAllMovies,
  getSpecificMovie,
  requestedMoviePage,
  getMoviesJSON,
  getAllMoviesTester,
  getSpecificMovieJSON,
  addToWishlist,
  screenSize,
  movieCount,
} = require("../controllers/movieController");
const router = express.Router();
const { checkauth, customerauth, userauth } = require("../middleware/auth");

router.get("/requestMovie", requestedMoviePage);

router.get("/addtowishlist/:movieId", customerauth, addToWishlist);

router.get("/movies/select", checkauth, getMoviesSort);

router.get("/addToCart/:movieId", customerauth, addToCart);

router.post("/requestmovie", customerauth, requestedMovie);

router.get("/movies/", checkauth, getMovies);

router.get("/movieCount", movieCount);

router.get("/moviesjson", checkauth, getMoviesJSON);

router.get("/screensize/:screenSize", checkauth, screenSize);

router.get("/movies/test", getAllMoviesTester);

router.get("/createmoviespage", userauth, createMoviesPage);

router.get("/getallmovies", checkauth, getAllMovies);

router.post("/createmovies", userauth, createMovies);

router.get("/search", checkauth, displayMovie);

router.get("/:mid", checkauth, getSpecificMovie);

router.get("/:mid/getSpecificMovieJSON", checkauth, getSpecificMovieJSON);

module.exports = router;
