const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type:String,
                required:true,
                minlength:5,
                maxlength:50,
                unique:true
            },
            isGold:{
                type:Boolean,
                default:false
            },
            phone:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50,
                unique:true
            },
            password:{type:String}
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
});

const Rental = mongoose.model('Rental', rentalSchema)


function vaildateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
      });
    return schema.validate(rental);
 } 

 exports.Rental = Rental;
 exports.validate = vaildateRental;
