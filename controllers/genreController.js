const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre')

exports.getGenres = async (req, res) =>{
   const genres = await Genre.find().sort('name');
   res.status(200).json(genres);
}

exports.createGenre = async(req, res) =>{
   const { error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   let genre = new Genre({name: req.body.name});
   genre = await genre.save();
   res.send(genre);
}

exports.updateGenre = async(req, res) =>{
   const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const genre =await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
       new :true
   })
    if(!genre) return res.status(404).send('Genre not found');

    res.send(genre);
}

exports.deleteGenre = async (req, res) => {
   const genre =await Genre.findByIdAndRemove(req.params.id);

     if(!genre) return res.status(404).send('Genre not found');
 
     res.send(genre);
 }

 exports.getSpecificGenre = async(req, res) => {
   let genre =  await Genre.findById(req.params.id);
     if(!genre) return res.status(404).send('Genre not found');
     res.send(genre);
 }