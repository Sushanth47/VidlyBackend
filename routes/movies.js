require('dotenv').config()
const {Movie} = require('../models/movie');
// const {Requested} = require('../models/requestedModel');
const express = require('express');
const {
    getMovies, createMovies, othermovies, requestedMovie,updateMovies, deleteMovies,
     createMoviesPage, displayMovie, getSpecificMovie, requestedMoviePage,addToWishlist
} = require('../controllers/movieController');
const router = express.Router();
const {  checkauth, customerauth, newauth, userauth } = require('../middleware/auth');
const { Customer } = require('../models');

router.get('/requestMovie', requestedMoviePage);

router.get('/addtowishlist/:movieId', customerauth, addToWishlist);

router.post('/requestmovie', requestedMovie);

router.get('/movies',newauth,getMovies);

router.get('/createmoviespage',userauth,createMoviesPage);

router.post('/createmovies', userauth,createMovies)
router.get('/search',displayMovie);

router.get('/:mid', getSpecificMovie);
// router.get('/othermovies', othermovies);
// router.get('/search/', displayMovieSearch);
// router.put('/updatemovies/:id',isAdmin,updateMovies )
 
 //to delete a genre
//  router.delete('/deletemovies/:id', isAdmin,deleteMovies)
 
 
 
 //to get by id
//  router.post('/getspecificmovies', getSpecificMovie);

 module.exports = router, Movie;

