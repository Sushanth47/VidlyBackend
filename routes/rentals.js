const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const { getRentals, createRentals, updateGenre, deleteGenre, getSpecificGenre} = require('../controllers/genreController');
const Fawn = require('fawn');

Fawn.init(mongoose);


 //to get the complete list
 router.get('/rentals', getRentals);
 
 
 // to post a new id into genre,
 router.post('/createrentals', createRentals);
 
 
 //to put ig
 router.put('/updaterentals/:id', updateGenre)
 
 //to delete a genre
 router.delete('/deleterentals/:id', deleteGenre)
 
 
 
 //to get by id
 router.get('/getspecificrental/:id', getSpecificGenre);

 module.exports = router, Rental;