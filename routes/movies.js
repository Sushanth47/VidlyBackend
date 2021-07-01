require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const express = require('express');
const {getMovies, createMovies, updateMovies, deleteMovies, getSpecificMovie} = require('../controllers/movieController');
const router = express.Router();

router.get('/movies', getMovies);

router.post('/createmovies', createMovies)

router.put('/updatemovies/:id',updateMovies )
 
 //to delete a genre
 router.delete('/deletemovies/:id', deleteMovies)
 
 
 
 //to get by id
 router.get('/getspecificmovies/:id', getSpecificMovie);

 module.exports = router, Movie;

