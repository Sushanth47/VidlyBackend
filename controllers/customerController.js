const {Customer, validate} = require('../models/customer')
const express = require('express');
const router = express.Router();







exports.updateCustomers = async(req, res) =>{
  const { error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
  
   const customer =await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
      new :true
  })
   if(!customer) return res.status(404).send('Customer not found');

   res.send(customer);
}


exports.deleteCustomer = async (req, res) => {
 const customer =await Customer.findByIdAndRemove(req.params.id);

   if(!customer) return res.status(404).send('Customer not found');

   res.send(customer);
}

exports.getSpecificCustomer = async(req, res) => {

 let customer =  await Customer.findById(req.params.id);
   if(!customer) return res.status(404).send('Customer not found');
   res.send(customer);
}
