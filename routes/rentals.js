const express = require('express');
const router = express.Router();
const {userauth, customerauth} = require('../middleware/auth');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const { getRentals, createRentals, updateRentals, deleteRentals, getSpecificRentals} = require('../controllers/rentalController');
const Fawn = require('fawn');

Fawn.init(mongoose);


 //to get the complete list
 router.get('/rentals', userauth,getRentals);
 
 
 // to post a new id into genre,
 router.post('/createrentals', customerauth,createRentals);
 
 
 //to put ig
 router.put('/updaterentals/:id', customerauth,updateRentals)
 
 //to delete a genre
 router.delete('/deleterentals/:id', customerauth,deleteRentals)
 
 
 
 //to get by id
 router.get('/getspecificrental/:id', customerauth,getSpecificRentals);

 module.exports = router, Rental;