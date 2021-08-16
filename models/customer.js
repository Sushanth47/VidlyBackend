const mongoose = require('mongoose');
// const Joi= require('joi');
const customerSchema = new mongoose.Schema({
    name:{
        required:true,
        type: String,
        minlength: 4,
        unique:true
    },
    isGold: {
        type:Boolean, 
        default:false
    },
    active: {
        type:Boolean,
        default:false
   },
    phoneToken: {
    type: String,
    default:"N/A",
    sparse:true,

  },
    phone: {
        type: String, 
        required: true,
        minlength: 4,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:1}
    },
   
    
    {timestamps: true});

const Customer = mongoose.model('Customer', customerSchema)

 exports.Customer = Customer;
 
//  exports.validate = vaildateCustomer;
