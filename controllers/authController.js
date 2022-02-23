require("dotenv").config();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { User } = require("../models/user");
const { Customer } = require("../models/customer");

async function generateAuthToken(res, _id, name, subject, cart, wishList) {
  const expiration = 604800000;
  const token = jwt.sign(
    { _id: _id, name: name, subject: subject, cart: cart, wishList: wishList },
    process.env.jwtPrivateKey,
    {
      expiresIn: process.env.DB_ENV === "testing" ? "1d" : "7d",
    }
  );
  var obj = {
    token: token,
    name: name,
    _id: _id,
    subject: subject,
    cart: cart,
    wishList: wishList,
    screenSize: 4,
  };
  res.cookie("token", obj, {
    expires: new Date(Date.now() + expiration),
    httpOnly: true,
    secure: true,
  });
  return token;
}

exports.loginPage = async (req, res) => {
  var type = "userLogin";
  return res
    .status(200)
    .render("./loginPage.ejs", { type: type, message: req.flash("message") });
};

exports.signupPage = async (req, res) => {
  var type = "userSignup";
  return res
    .status(200)
    .render("./signupPage", { type: type, message: req.flash("message") });
};

exports.signupPageCustomer = async (req, res) => {
  var type = "customerSignup";
  return res
    .status(200)
    .render("signupCustomer", { type: type, message: req.flash("message") });
};

exports.loginPageCustomer = async (req, res) => {
  var type = "customerLogin";
  return res
    .status(200)
    .render("loginCustomer.ejs", { type: type, message: req.flash("message") });
};

exports.getUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      req.flash("message", "User already registered");
      return res.status(304).redirect("/api/auth/signupData");
    }
    var newuser = await User.create({
      name: name,
      email: email,
      password: password,
    });
    var cart = [],
      wishList = [];
    await generateAuthToken(
      res,
      newuser._id,
      newuser.name,
      "User",
      cart,
      wishList
    );
    newuser.active = true;
    user.save();
    return res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getUserfromdata = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user || req.body.password != user.password) {
    req.flash("message", "Invalid Email/Password");
    return res.status(400).redirect("/api/auth/signupData");
  }
  var cart = [],
    wishList = [];
  const token = generateAuthToken(
    res,
    user._id,
    user.name,
    "User",
    cart,
    wishList
  );

  user.active = true;

  user.save();
  return res.status(200).redirect("/");
};

exports.logoutUser = async (req, res) => {
  try {
    var userfind = await User.findOne({ _id: req.user._id });
    userfind.active = false;
    userfind.phoneToken = "";
    userfind.save();

    res.clearCookie("token");
    return res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.logoutCustomer = async (req, res) => {
  try {
    var customerfind = await Customer.findOne({ _id: req.user._id });
    customerfind.active = false;
    customerfind.phoneToken = "";
    customerfind.save();
    res.clearCookie("token");
    return res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getCustomerfromData = async (req, res) => {
  try {
    console.log("camehere");
    var customer = await Customer.findOne({
      phone: req.body.phone,
    });
    console.log("come here");
    if (!customer || req.body.password != customer.password) {
      req.flash("message", "Wrong Credentials");

      return res.status(409).redirect("/api/auth/loginCustomer");
    }
    const token = generateAuthToken(
      res,
      customer._id,
      customer.name,
      "Customer",
      customer.wishList,
      customer.cart
    );
    token.then((value) => {
      customer.phoneToken = value;
    });
    customer.save();
    return res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getCustomer = async (req, res) => {
  try {
    var customer = await Customer.findOne({ phone: req.body.phone });
    if (customer) {
      req.flash("message", "User already exists");
      return res.redirect("/api/auth/signupPage");
    }
    customer = await Customer.create({
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
    });
    const token = await generateAuthToken(
      res,
      customer._id,
      customer.name,
      "Customer",
      customer.cart,
      customer.wishList
    );
    customer.phoneToken = token;
    customer.active = true;
    customer.isGold = false;
    await customer.save();
    return res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
  }
};
