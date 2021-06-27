const mongoose = require('mongoose');
const Joi= require('joi');
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name:{
        required:true,
        type: String,
        minlength: 4
    },
    isGold: {
        type:Boolean, 
        default:false
    },
    phone: {
        type: String, 
        required: true,
         minlength: 4
    }
}));
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