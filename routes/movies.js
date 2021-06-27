const {Movie, validate} = require('../models/movie');
const express = require('express');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/movies', async(req, res) =>{
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/createmovies', async(req, res)=>{

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).json('Invalid Genre');

    let movie = new Movie({
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        img:req.body.img,
        link:req.body.link,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
     movie.save();
     res.status(200).send(movie)
})

router.put('/updatemovies/:id', async(req, res) =>{
    // const { error } = validate(req.body);
    //  if(error) return res.status(400).send(error.details[0].message);
    
     const movie =await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title}, {
        new :true
    })
     if(!movie) return res.status(404).send('Movie not found');
 
     res.send(movie);
 })
 
 //to delete a genre
 router.delete('/deletemovies/:id', async (req, res) => {
   const movie =await Movie.findByIdAndRemove(req.params.id);
 
     if(!movie) return res.status(404).send('Movie not found');
 
     res.send(movie);
 })
 
 
 
 //to get by id
 router.get('/getspecificmovies/:id', async(req, res) => {
 
   let movie =  await Movie.findById(req.params.id);
     if(!movie) return res.status(404).send('Movie not found');
     res.send(movie);
 });

 module.exports = router, Movie;

