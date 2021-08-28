const express = require('express');
const router = express.Router();
const { checkauth} = require('../middleware/auth');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const { getRentals, createRentals, updateRentals, deleteRentals, getSpecificRentals} = require('../controllers/rentalController');
const Fawn = require('fawn');

Fawn.init(mongoose);


 //to get the complete list
 router.get('/rentals', checkauth,getRentals);
 
 
 // to post a new id into genre,
 router.post('/createrentals', checkauth,createRentals);
 
 
 //to put ig
 router.put('/updaterentals/:id', checkauth,updateRentals)
 
 //to delete a genre
 router.delete('/deleterentals/:id', checkauth,deleteRentals)
 
 
 
 //to get by id
 router.get('/getspecificrental/:id', checkauth,getSpecificRentals);

 module.exports = router, Rental;