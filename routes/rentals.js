const express = require('express');
const router = express.Router();
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental')
const Fawn = require('fawn');

Fawn.init(mongoose);


 //to get the complete list
 router.get('/', async (req, res) =>{
     const rentals = await rental.find().sort('-dateOut');
     res.send(rentals);
 });
 
 
 // to post a new id into genre,
 router.post('/', async(req, res) => {
     const { error } = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);
 
     const customer = await Customer.findById(req.body.customerId);
     if (!customer) return res.status(400).send('Invalid customer.');

     const movie = await Movie.findById(req.body.movieId);
     if(!movie) return res.status(400).send('Invalid movie');

     if (movie.numberInStock === 0) return res.status(400).send('Movie not in Stock')

     let rental = new Rental({
         customer: {
             _id: customer._id,
             name: customer.name,
             phone: customer.phone
         },
          movie: {
              _id: movie._id,
              title: movie.title,
              dailyRentalRate: movie.dailyRentalRate
          }
     });
     
     try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id:movie._id}, {
                $inc: { numberInStock: -1 }
            })
            .run();
     }
     catch(ex){
         res.status(500).send('Something Failed');
     }
     
     res.send(rental);
 });
 
 
 //to put ig
 router.put('/:id', async(req, res) =>{
    const { error } = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);
    
     const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
        new :true
    })
     if(!rental) return res.status(404).send('Rental not found');
 
     res.send(rental);
 })
 
 //to delete a genre
 router.delete('/:id', async (req, res) => {
   const rental =await Rental.findByIdAndRemove(req.params.id);

     if(!rental) return res.status(404).send('Rental not found');
 
     res.send(rental);
 })
 
 
 
 //to get by id
 router.get('/:id', async(req, res) => {

   let rental =  await Rental.findById(req.params.id);
     if(!rental) return res.status(404).send('Rental not found');
     res.send(rental);
 });

 module.exports = router, Rental;