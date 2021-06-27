const mongoose = require('mongoose');
const Joi = require('Joi')
const {genreSchema} = require('./genre');


const Movie = mongoose.model('Movie', new.mongoose.Schema({
    title:{
        type:String,
         required: true,
          trime:true
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        required: true,
        min:0,
        max:255
        },
    dailyRentalRate: { type:Number, required: true, min:0, max:255 }
}));

// vaildateMovie = (movie)=>{
//     const schema = {
//         title:Joi,string().min()
//         genreId:
//         numberInStock:
//         dailyRentalRate:
//     }
// }


exports.Movie = Movie;