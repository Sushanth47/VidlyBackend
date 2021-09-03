const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const Fawn = require('fawn');


exports.getRentals= async (req, res) =>{
   const rentals = await Rental.find().sort('-dateOut');
   console.log(rentals)
   res.send(rentals);
}



exports.createRentals = async(req, res) => {
   if(!mongoose.Types.ObjectId.isValid(req.body.customerId)){
      return res.status(400).send('Invalid ID');
   }

   const customer = await Customer.findById(req.user._id);
   if (!customer) return res.status(400).send('Invalid customer.');

   if(!mongoose.Types.ObjectId.isValid(req.body.movieId)){
      return res.status(400).send('Invalid ID');
   }

   const movie = await Movie.findById(req.body.movieId);
   if(!movie) return res.status(400).send('Invalid movie');

   if (movie.numberInStock === 0) return res.status(400).send('Movie not in Stock')

//    let rental = new Rental({
//        customer: {
//            _id: customer._id,
//            name: customer.name,
//            phone: customer.phone
//        },
//         movie: {
//             _id: movie._id,
//             title: movie.title,
//             dailyRentalRate: movie.dailyRentalRate,
//             link: movie.link,
//             img: movie.img
//         }
//    });
    var obj = {
        customer:req.user._id,
        movie:req.body.movieId,
        rentalFee: movie.dailyRentalRate,
        checkOut:false
    }
    await Rental.create(obj);
   
   try {
      new Fawn.Task()
          .update('movies', { _id:movie._id}, {
              $inc: { numberInStock: -1 }
          })
          .run();
   }
   catch(ex){
       res.status(500).send('Something Failed');
   }
   
   res.redirect(`/api/movies/${req.body.movieId}`);
}

exports.updateRentals = async(req, res) =>{
   const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
       new :true
   })
    if(!rental) return res.status(404).send('Rental not found');

    res.send(rental);
}

exports.deleteRentals = async (req, res) => {
   const rental =await Rental.findByIdAndRemove(req.params.id);

     if(!rental) return res.status(404).send('Rental not found');
 
     res.send(rental);
 }

 exports.getSpecificRentals = async(req, res) => {
   let rental =  await Rental.findById(req.params.id);
     if(!rental) return res.status(404).send('Rental not found');
     res.send(rental);
 }