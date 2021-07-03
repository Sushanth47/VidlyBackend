const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

exports.signup = async(req, res)=>{
   const signingup = await Customer.find({});
   
   signingup.forEach(list=>{
      console.log('ha')
      list.name = req.body.name;
      list.phone = req.body.phone;
      list.password = req.body.password;
      list.isGold = false
      list.save();
   })
   console.log(signingup);
   return res.status(200).send(signingup);
}