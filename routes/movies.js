require("dotenv").config();
const { Movie } = require("../models/movie");
// const {Requested} = require('../models/requestedModel');
const express = require("express");
const {
  getMovies,
  createMovies,
  othermovies,
  requestedMovie,
  updateMovies,
  addToCart,
  deleteMovies,
  getMoviesSort,
  createMoviesPage,
  displayMovie,
  getSpecificMovie,
  requestedMoviePage,
  addToWishlist,
} = require("../controllers/movieController");
const router = express.Router();
const {
  checkauth,
  customerauth,
  newauth,
  userauth,
} = require("../middleware/auth");

router.get("/requestMovie", customerauth, requestedMoviePage);

router.get("/addtowishlist/:movieId", customerauth, addToWishlist);

router.post("/movies/select", checkauth, getMoviesSort);

router.get("/addToCart/:movieId", customerauth, addToCart);

router.post("/requestmovie", customerauth, requestedMovie);

router.get("/movies", checkauth, getMovies);

router.get("/createmoviespage", userauth, createMoviesPage);

router.post("/createmovies", userauth, createMovies);

router.get("/search", checkauth, displayMovie);

router.get("/:mid", checkauth, getSpecificMovie);

(module.exports = router), Movie;
