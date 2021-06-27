const mongoose = require('mongoose');
const Joi = require('Joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema)


function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
      });
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
