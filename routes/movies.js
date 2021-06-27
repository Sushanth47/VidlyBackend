const {Movie} = require('../models/movie');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async(req, res) =>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.post('/', async(req, res)=>{

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Invalid Genre');

    let movie = new Movie({
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
     movie.save((err)=>{
         if(err) throw (err);
         res.status(200).send(movie);
     });
})

router.put('/:id', async(req, res) =>{
    // const { error } = validate(req.body);
    //  if(error) return res.status(400).send(error.details[0].message);
    
     const movie =await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title}, {
        new :true
    })
     if(!movie) return res.status(404).send('Movie not found');
 
     res.send(movie);
 })
 
 //to delete a genre
 router.delete('/:id', async (req, res) => {
   const movie =await Movie.findByIdAndRemove(req.params.id);
 
     if(!movie) return res.status(404).send('Movie not found');
 
     res.send(movie);
 })
 
 
 
 //to get by id
 router.get('/:id', async(req, res) => {
 
   let movie =  await Movie.findById(req.params.id);
     if(!movie) return res.status(404).send('Movie not found');
     res.send(movie);
 });

 module.exports = router, Movie;

