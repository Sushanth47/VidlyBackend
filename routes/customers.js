// const {Customer, validate} = require('../models/customer')
const express = require('express');
const router = express.Router();
const {getCustomers, createCustomers, updateCustomers, deleteCustomer, getSpecificCustomer } = require('../controllers/customerController');

router.get('/customers', getCustomers);


// to post a new id into genre,
router.post('/createcustomers',createCustomers);




//to put ig
router.put('/updatecustomers/:id', updateCustomers)

//to delete a genre
router.delete('/deletecustomers/:id', deleteCustomer)



//to get by id
router.get('/getspecificcustomer/:id', getSpecificCustomer);




module.exports = router;



//In Controllers

