const mongoose = require('mongoose');
// const Joi = require('Joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    img:{type:String},
    description:{type:String}
},
{timestamps:true});

const Genre = mongoose.model('Genre', genreSchema)




exports.Genre = Genre;
