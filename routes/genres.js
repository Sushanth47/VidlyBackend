const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre')



 //to get the complete list
 router.get('/genres', async (req, res) =>{
     const genres = await Genre.find().sort('name');
     res.status(200).json(genres);
 });
 
 
 // to post a new id into genre,
 router.post('/creategenres', async(req, res) => {
     const { error } = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);
 
 
     let genre = new Genre({name: req.body.name});
     genre = await genre.save();
     res.send(genre);
 });
 
 
 //to put ig
 router.put('/updategenres/:id', async(req, res) =>{
    const { error } = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);
    
     const genre =await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
        new :true
    })
     if(!genre) return res.status(404).send('Genre not found');
 
     res.send(genre);
 })
 
 //to delete a genre
 router.delete('/deletegenres/:id', async (req, res) => {
   const genre =await Genre.findByIdAndRemove(req.params.id);

     if(!genre) return res.status(404).send('Genre not found');
 
     res.send(genre);
 })
 
 
 
 //to get by id
 router.get('/getspecificgenre/:id', async(req, res) => {

   let genre =  await Genre.findById(req.params.id);
     if(!genre) return res.status(404).send('Genre not found');
     res.send(genre);
 });

 module.exports = router, Genre;