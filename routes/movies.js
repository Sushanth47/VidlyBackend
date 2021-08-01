require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const {Requested} = require('../models/requestedModel');
const isAdmin = require('../middleware/auth');
// const {Requested} = require('../models/requestedModel');
const express = require('express');
const {getMovies, createMovies, othermovies, requestedMovie,updateMovies, deleteMovies, displayMovieSearch,createMoviesPage, displayMovie} = require('../controllers/movieController');
const router = express.Router();
const middlemass = require('../middleware/auth');

router.post('/requestmovie', middlemass, requestedMovie);

router.get('/movies', getMovies);

router.get('/createmoviespage',middlemass,createMoviesPage);

router.post('/createmovies',middlemass, createMovies)
router.get('/:title', displayMovie);
// router.get('/othermovies', othermovies);
router.post('/search', displayMovieSearch);
// router.put('/updatemovies/:id',isAdmin,updateMovies )
 
 //to delete a genre
//  router.delete('/deletemovies/:id', isAdmin,deleteMovies)
 
 
 
 //to get by id
//  router.post('/getspecificmovies', getSpecificMovie);

 module.exports = router, Movie;

