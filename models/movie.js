const mongoose = require('mongoose');
const Joi = require('Joi')
const {genreSchema} = require('./genre');


const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trime:true
    },
    genreId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Genre',
        required:true
    },
    rank:{type:Number},
    cast:{type:String},
    year:{type:String},
    img:{
        type:String,
    },
    links:{
        type:String
    },
    numberInStock:{
        type:Number,
        required: true,
        min:0,
        max:255
        },
    dailyRentalRate: {
        type:Number,
        required: true,
        min:0,
        max:255
    },
    ismovieCreated:{type:Boolean, default:false},
    requestCount:{type:Number, default:0}
},
{
    timestamps:true
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title:Joi.string().min(5).max(50).required(),
        // genreId:Joi.objectId().required()
    });
    return schema.validate(movie);
}
exports.validate = validateMovie();
exports.movieSchema = movieSchema

exports.Movie = Movie;