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
  try {
    var customer = await Customer.findOne({ _id: req.user._id }).populate(
      "cart"
    );
    var ans = 0,
      moviearr = [],
      arr = [],
      dateOut = "",
      rentalFee = 0,
      checkOut = "";
    const date = new Date();
    if (customer.cart.length != 0) {
      for (var i = 0; i < customer.cart.length; i++) {
        var movie = await Movie.findOne({ _id: customer.cart[i]._id });
        movie.rentedCustomers.push(customer._id);
        await movie.save();
      }
      customer.cart.forEach((list) => {
        arr.push(list._id);
        ans += req.query.days * list.dailyRentalRate;
      });
      console.log(arr, "arr push for customer");
      // var newarr = [];
      // for (var i = 0; i < arr.length; i++) {
      //   newarr.push(arr[i]);
      // }
      // customer.rentedMovies.push(newarr);

      var rental = await Rental.create({
        customer: req.user._id,
        movie: arr,
        dateOut: date,
        dateReturned: Date.now() + req.query.days * 86400000,
        rentalFee: ans,
      });

      const rentId = `MOV-${rental._id}`;
      rental.checkOut = rentId;
      moviearr = rental.movie;
      console.log(rental, "rental");
      dateReturned = rental.dateReturned;
      rentalFee = rental.rentalFee;
      checkOut = rental.checkOut;
      customer.cart = [];
      customer.rentedMovies.push(rental._id);
      customer.save();
    } else {
      var rentals = await Rental.findOne({ customer: req.user._id })
        .sort({
          _id: -1,
        })
        .populate("movie");

      rentals.movie.forEach(async (list) => {
        var moviess = await Movie.findOne({ _id: list });
        moviess.numberInStock--;
        await moviess.save();
        moviearr.push(moviess.title);
      });
      dateOut = rentals.dateOut.toString();
      rentalFee = rentals.rentalFee;
      checkOut = rentals.checkOut;
    }

    var returnobject = {
      customer: req.user._id,
      movie: moviearr,
      dateOut: date,
      dateReturned: dateOut,
      rentalFee: rentalFee,
      checkOut: checkOut,
    };
    // setTimeout();
    return res.render("bill", { rental: returnobject });
  } catch (err) {
    console.log(err);
  }
};
