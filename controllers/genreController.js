const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre')

exports.getGenres = async (req, res) =>{
   const genres = await Genre.find().sort('name');
   res.status(200).json(genres);
}

exports.createGenre = async(req, res) =>{
   var obj = {
      name: req.body.name, img:req.body.img, description:req.body.description
   }
   await Genre.create(obj);
   res.send(obj);
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