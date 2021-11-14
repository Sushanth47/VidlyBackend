const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental } = require("../models/rental");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.rentalPage = async (req, res) => {
  var customer = await Customer.findOne({ _id: req.user._id }, "cart").populate(
    "cart"
  );
  var subject = "rentals";
  return res.render("rentalpage.ejs", { customer: customer, subject: subject });
};
exports.billPage = async (req, res) => {
  return res.render("bill.ejs");
};
exports.rentalDisplay = async (req, res) => {
  var rental = await Rental.aggregate([
    {
      $match: {
        customer: ObjectId(req.user._id),
      },
    },
    {
      $project: {
        movies: 1,
        customer: 1,
        rentalFee: 1,
        checkOut: 1,
        dateGone: {
          $dateToString: { format: "%Y-%m-%d", date: "$dateOut" },
        },
        dateCome: {
          $dateToString: { format: "%Y-%m-%d", date: "$dateReturned" },
        },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 1 },
  ]);
  return res.status(200).json({ rental: rental });
};

exports.checkout = async (req, res, next) => {
  try {
    var customer = await Customer.findOne({ _id: req.user._id }).populate(
      "cart"
    );
    var ans = 0;
    var arr = [];
    var newarr = [];
    var date = new Date();

    for (var i = 0; i < customer.cart.length; i++) {
      var movie = await Movie.findOne({ _id: customer.cart[i]._id });
      movie.rentedCustomers.push(customer._id);
      await movie.save();
      arr.push(movie._id);
      newarr.push(movie.title);
      ans += req.body.days * movie.dailyRentalRate;
    }

    var rental = await Rental.create({
      customer: req.user._id,
      movie: arr,
      movies: newarr,
      dateOut: date,
      dateReturned: Date.now() + req.body.days * 86400000,
      rentalFee: ans,
    });
    customer.cart = [];
    customer.rentedMovies.push(rental._id);
    customer.save();

    next();
  } catch (err) {
    console.log(err);
  }
};
