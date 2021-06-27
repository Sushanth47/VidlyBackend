const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = new mongoose.Model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type:String,
                required:true,
                minlength:5,
                maxlength:50
            },
            isGold:{
                type:Boolean,
                default:false
            },
            phone:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50
            }
        }),
        required:true
    },
    movie: {
        type:new mongoose.Schema({
            title:{
                type:String,
                required:true,
                trime:true,
                minlength:5,
                maxlength: 255
            },
            dailyRentalRate: {
                type:Number,
                required:true,
                min:0,
                max: 255
            }
        }),
        required:true
    },
    dateOut: {
        type:Date,
        required:true,
        default:Date.now
    },
    dateReturned: {
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0
    }
}));


function vaildateRental(rental){
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
      });
    return schema.validate(rental, schema);
 } 

 exports.Rental = Rental;
 exports.validate = vaildateRental;
