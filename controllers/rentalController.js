const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
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
  customer.cart.forEach((list) => {
    arr.push(list._id);
    ans += req.query.days * list.dailyRentalRate;
  });
  const rentId = `MOV-${customer.createdAt
    .getTime()
    .toString()}-${date.getTime()}`;

  var rental = Rental.create({
    customer: req.user._id,
    movie: arr,
    dateOut: date,
    dateReturned: Date.now() + req.query.days * 86400000,
    rentalFee: ans,
    checkOut: rentId,
  });
  customer.cart = [];
  customer.save();
  rental.checkOut = rentId;
  // rental.save();
  return res.redirect("/api/customers/getrentals");
};
