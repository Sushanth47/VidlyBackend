require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const Joi = require('Joi')
const express = require('express');
const app = express();
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
  },
  active: {
   type:Boolean,
   default:false
   },
  phoneToken:{
    type:String,
    default:"N/A",
    unique:true
  },
  imgs:[
    {type:String}
  ]
},
{
  timestamp:true
});



const User = mongoose.model('User', userSchema)

exports.User = User;

