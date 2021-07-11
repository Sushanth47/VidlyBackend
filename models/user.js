const mongoose = require('mongoose');
const Joi = require('Joi')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        required:true
    },
    email: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      required:true,
      unique:true
  },
  password:{
     type:String,
     required:true
  }

});

const User = mongoose.model('User', userSchema)


function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email:Joi.string().min(3).required().email(),
        password: Joi.string.min(3).required()
      });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
