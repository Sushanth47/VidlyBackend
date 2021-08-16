require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const {Requested} = require('../models/requestedModel');
const isAdmin = require('../middleware/auth');
// const {Requested} = require('../models/requestedModel');
const express = require('express');
const {getMovies, createMovies, othermovies, requestedMovie,updateMovies, deleteMovies, createMoviesPage, displayMovie, getSpecificMovie, requestedMoviePage} = require('../controllers/movieController');
const router = express.Router();
const { userauth, customerauth, guestauth } = require('../middleware/auth');

router.get('/requestMovie', customerauth, requestedMoviePage);

router.post('/requestmovie', requestedMovie);

router.get('/movies', guestauth,getMovies);

router.get('/createmoviespage',userauth,createMoviesPage);

router.post('/createmovies', createMovies)
router.get('/search', displayMovie);

router.get('/:mid', getSpecificMovie);
// router.get('/othermovies', othermovies);
// router.get('/search/', displayMovieSearch);
// router.put('/updatemovies/:id',isAdmin,updateMovies )
 
 //to delete a genre
//  router.delete('/deletemovies/:id', isAdmin,deleteMovies)
 
 
 
 //to get by id
//  router.post('/getspecificmovies', getSpecificMovie);

 module.exports = router, Movie;

