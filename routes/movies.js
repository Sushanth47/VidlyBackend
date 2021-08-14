require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const {Requested} = require('../models/requestedModel');
const isAdmin = require('../middleware/auth');
// const {Requested} = require('../models/requestedModel');
const express = require('express');
const {getMovies, createMovies, othermovies, requestedMovie,updateMovies, deleteMovies, createMoviesPage, displayMovie} = require('../controllers/movieController');
const router = express.Router();
const { userauth, customerauth, guestauth } = require('../middleware/auth');

router.post('/requestmovie', userauth, requestedMovie);

router.get('/movies', guestauth,getMovies);

router.get('/createmoviespage',userauth,createMoviesPage);

router.post('/createmovies',userauth, createMovies)
router.get('/search', displayMovie);
// router.get('/othermovies', othermovies);
// router.get('/search/', displayMovieSearch);
// router.put('/updatemovies/:id',isAdmin,updateMovies )
 
 //to delete a genre
//  router.delete('/deletemovies/:id', isAdmin,deleteMovies)
 
 
 
 //to get by id
//  router.post('/getspecificmovies', getSpecificMovie);

 module.exports = router, Movie;

