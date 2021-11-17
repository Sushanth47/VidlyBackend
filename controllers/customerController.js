const { Mongoose } = require("mongoose");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const { Review } = require("../models/reviews");

exports.getWishlist = async (req, res) => {
  try {
    var cust = await Customer.findOne({ _id: req.user._id }).populate(
      "wishList"
    );
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
    var subject = "cart";
    return res
      .status(200)
      .render("./myWatchlist.ejs", { cust: cust, subject: subject });
  } catch (err) {
    console.log(err);
  }
};

exports.getRentals = async (req, res) => {
  try {
    var subject = "rental";
    var othercust = await Rental.aggregate([
      {
        $match: { customer: ObjectId(req.user._id) },
      },
      {
        $project: {
          movie: 1,
          movies: 1,
          rentalFee: 1,
          customer: 1,
          dateOut: 1,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movie",
        },
      },
    ]);
    console.log(othercust, "othercust");

    return res.render("./myWatchlist.ejs", {
      cust: othercust,
      subject: subject,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateCustomers = async (req, res) => {
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

exports.goldCustomerPage = async (req, res) => {
  return res.render("goldPage.ejs");
};

exports.giveReview = async (req, res) => {
  var customer = await Customer.findOne({ _id: req.user._id }, "rentedMovies");
  if (customer.rentedMovies.includes(req.params.mid)) {
    await Review.create({
      movieId: req.params.mid,
      rating: req.body.rating,
      reviews: req.body.reviews,
    });
  } else {
    return res.status(200).json("You have already reviewed this movie");
  }

  return res.status(200).redirect(`/api/movies/${req.params.mid}`);
};

exports.applyGold = async (req, res) => {
  return res.render("goldpage", { message: req.flash("message") });
};

exports.ApplyGold = async (req, res) => {
  const { password, email } = req.body;
  var customer = await Customer.findOne({ email: email });
  if (password != customer.password || !customer) {
    req.flash("message", "Wrong Credentials");
    res.redirect("/api/customers/goldpage");
  }
  customer.isGold = true;
  customer.save();
  return res.status(200).redirect("/api/movies/movies");
};

exports.pullFromCart = async (req, res) => {
  await Customer.updateOne(
    { _id: req.user._id },
    { $pull: { cart: req.params.movieId } }
  );
  return res.status(200).redirect("/api/customers/getMyCart");
};

exports.pullFromList = async (req, res) => {
  await Customer.updateOne(
    { _id: req.user._id },
    { $pull: { wishList: req.params.movieId } }
  );
  return res.status(200).redirect("/api/customers/getWishlist");
};
