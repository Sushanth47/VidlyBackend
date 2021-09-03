const { Customer, validate } = require("../models/customer");
// const express = require("express");
// const router = express.Router();
// const { Customer } = require("../models/customer");

exports.getWishlist = async (req, res) => {
  try {
    var cust = await Customer.findOne({ _id: req.user._id }).populate(
      "wishList"
    );
    //   console.log(cust);
    var subject = "wishList";
    return res
      .status(200)
      .render("./myWatchlist.ejs", { cust: cust, subject: subject });
  } catch (err) {
    console.log(err);
  }
};

exports.getMyCart = async (req, res) => {
  try {
    var cust = await Customer.findOne({ _id: req.user._id }).populate("cart");
    //   console.log(cust);
    var subject = "cart";
    return res
      .status(200)
      .render("./myWatchlist.ejs", { cust: cust, subject: subject });
  } catch (err) {
    console.log(err);
  }
};

exports.updateCustomers = async (req, res) => {
  //   const { error } = validate(req.body);
  //    if(error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );
  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
};

exports.deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("Customer not found");

  res.send(customer);
};

exports.getSpecificCustomer = async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer not found");
  res.send(customer);
};
