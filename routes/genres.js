const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/auth');
const { Genre, validate } = require('../models/genre')
const { getGenres, createGenre, updateGenre, deleteGenre, getSpecificGenre} = require('../controllers/genreController');


 //to get the complete list
 router.get('/genres', getGenres);
 
 
 // to post a new id into genre,
 router.post('/creategenres', isAdmin,createGenre);
 
 
 //to put ig
 router.put('/updategenres/:id', isAdmin,updateGenre )
 
 //to delete a genre
 router.delete('/deletegenres/:id', isAdmin,deleteGenre)
 
 
 
 //to get by id
 router.get('/getspecificgenre/:id', getSpecificGenre);

 module.exports = router, Genre;