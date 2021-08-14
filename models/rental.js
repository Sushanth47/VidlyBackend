const mongoose = require('mongoose');
// const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    movie: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required:true
    },
    dateOut: {
        type:Date,
        required:true,
        default:Date.now()
    },
    dateReturned: {
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0
    }
},{timestamps:true});

const Rental = mongoose.model('Rental', rentalSchema)


// function vaildateRental(rental){
//     const schema = Joi.object({
//         customerId: Joi.objectId().required(),
//         movieId: Joi.objectId().required()
//       });
//     return schema.validate(rental);
//  } 

 exports.Rental = Rental;
//  exports.validate = vaildateRental;
