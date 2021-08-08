const mongoose = require('mongoose');
const Joi= require('joi');
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
    phoneToken:{
    type:String,
    default:"N/A",
    unique:true
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

function vaildateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(4).max(50).required(),
        isGold: Joi.boolean()
      });
    return schema.validate(customer);
 } 

 exports.Customer = Customer;
 
 exports.validate = vaildateCustomer;
