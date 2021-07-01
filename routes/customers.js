const {Customer, validate} = require('../models/customer')
const express = require('express');
const router = express.Router();


router.get('/customers', getCustomers);


// to post a new id into genre,
router.post('/createcustomers',createCustomers);




//to put ig
router.put('/updatecustomers/:id', updateCustomers)

//to delete a genre
router.delete('/deletecustomers/:id', deleteCustomer)



//to get by id
router.get('/getspecificcustomer/:id', getSpecificCustomer);




module.exports = router, Customer;



//In Controllers

exports.getCustomers= async (req, res) =>{
    const customers = await Customer.find({});
    console.log(customers);
    res.send(customers);
};


exports.createCustomers =  async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save();
    console.log(customer);
    res.send(customer);
}

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
