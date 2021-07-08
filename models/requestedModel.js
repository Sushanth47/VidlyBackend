const mongoose = require('mongoose');

// const {genreSchema} = require('./genre');


const requestedSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trime:true
    },
    ismovieCreated:{type:Boolean, default:false}
});

const Requested = mongoose.model('Requested', requestedSchema);

// function validateMovie(movie){
//     const schema = Joi.object({
//         title:Joi.string().min(5).max(50).required(),
//         // genreId:Joi.objectId().required()
//     });
//     return schema.validate(movie);
// }
// exports.validate = validateMovie();
exports.requestedSchema = requestedSchema

exports.Requested = Requested;
