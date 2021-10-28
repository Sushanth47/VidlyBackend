const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental } = require("../models/rental");

exports.rentalPage = async (req, res) => {
  var customer = await Customer.findOne({ _id: req.user._id }, "cart").populate(
    "cart"
  );
  var subject = "rentals";
  return res.render("rentalpage.ejs", { customer: customer, subject: subject });
};

exports.checkout = async (req, res) => {
  var customer = await Customer.findOne({ _id: req.user._id }).populate("cart");
  var ans = 0;
  var arr = [];
  const date = new Date();
  if (customer.cart.length != 0) {
    for (var i = 0; i < customer.cart.length; i++) {
      var movie = await Movie.findOne({ _id: customer.cart[i]._id });
      movie.rentedCustomers.push(customer._id);
      await movie.save();
    }
    customer.cart.forEach(async (list) => {
      arr.push(list._id);
      ans += req.query.days * list.dailyRentalRate;
    });
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {
      newarr.push(arr[i]);
    }
    customer.rentedMovies.push(newarr);

    var rental = Rental.create({
      customer: req.user._id,
      movie: arr,
      dateOut: date,
      dateReturned: Date.now() + req.query.days * 86400000,
      rentalFee: ans,
      // checkOut: rentId,
    });
    const rentId = `MOV-${rental._id}`;
    rental.checkOut = rentId;
    customer.cart = [];
    customer.save();
  }
  
  var rentals = await Rental.findOne({ customer: req.user._id }).sort({
    _id: -1,
  });

  var moviearr = [];
  rentals.movie.forEach(async (list) => {
    var moviess = await Movie.findOne({ _id: list });
    moviearr.push(moviess.title);
  });
  // var moviess = await
  var returnobject = {
    customer: req.user._id,
    movie: moviearr,
    dateOut: date,
    dateReturned: rentals.dateOut,
    rentalFee: rentals.rentalFee,
    checkOut: rentals.checkOut,
  };
  return res.render("bill", { rental: returnobject });
};
