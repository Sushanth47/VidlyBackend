const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/auth');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const { getRentals, createRentals, updateRentals, deleteRentals, getSpecificRentals} = require('../controllers/rentalController');
const Fawn = require('fawn');

Fawn.init(mongoose);


 //to get the complete list
 router.get('/rentals', isAdmin,getRentals);
 
 
 // to post a new id into genre,
 router.post('/createrentals', isAdmin,createRentals);
 
 
 //to put ig
 router.put('/updaterentals/:id', isAdmin,updateRentals)
 
 //to delete a genre
 router.delete('/deleterentals/:id', isAdmin,deleteRentals)
 
 
 
 //to get by id
 router.get('/getspecificrental/:id', isAdmin,getSpecificRentals);

 module.exports = router, Rental;