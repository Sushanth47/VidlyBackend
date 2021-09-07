require("dotenv").config();
const jwt = require("jsonwebtoken");
// const bcrypt = require('bcrypt');
const _ = require("lodash");
const { User } = require("../models/user");
const cookieParser = require("cookie-parser");
const { Customer } = require("../models/customer");

async function generateAuthToken(res, _id, name, subject) {
  //    res.clearCookie(req.headers['cookie']);
  const expiration = 604800000;
  const token = jwt.sign(
    { _id: _id, name: name, subject: subject },
    process.env.jwtPrivateKey,
    {
      expiresIn: process.env.DB_ENV === "testing" ? "1d" : "7d",
    }
  );
  //   console.log(token);
  var obj = {
    token: token,
    name: name,
    _id: _id,
    subject: subject,
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
  // console.log(req.user, 'req.user');
  return res.status(200).render("./loginPage.ejs", { type: type });
};

exports.signupPage = async (req, res) => {
  var type = "userSignup";
  return res.status(200).render("./signupPage", { type: type });
};

exports.signupPageCustomer = async (req, res) => {
  var type = "customerSignup";
  return res.status(200).render("./signupPage", { type: type });
};

exports.loginPageCustomer = async (req, res) => {
  var type = "customerLogin";
  return res.status(200).render("./loginPage.ejs", { type: type });
};

exports.getUser = async (req, res) => {
  res.clearCookie(req.headers["cookie"]);
  res.locals = {};
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const token = await generateAuthToken(res, user._id, user.name, "User");
  token.then((value) => {
    user.phoneToken = value;
  });
  user.active = true;
  req.user = user;
  await user.save();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
};

exports.getUserfromdata = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user || req.body.password != user.password) {
    return res.status(400).send("Invalid Email/Password");
  }
  const token = generateAuthToken(res, user._id, user.name, "User");
  token.then((value) => {
    user.phoneToken = value;
  });
  user.active = true;
  // req.user = user;
  user.save();
  return res.status(200).redirect("/api/movies/movies");
};

exports.logoutUser = async (req, res) => {
  try {
    console.log(req.user, "userhere");
    var userfind = await User.findOne({ _id: req.user._id });
    userfind.active = false;
	userfind.phoneToken = "";
    userfind.save();

    res.clearCookie("token");
    console.log("======================================================");
    return res.status(200).redirect("/api/movies/movies");
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
    return res.status(200).redirect("/api/movies/movies");
  } catch (err) {
    console.log(err);
  }
};

exports.getCustomerfromData = async (req, res) => {
  try {
    res.clearCookie(req.headers["cookie"]);
    res.locals.subject = "User";
    var customer = await Customer.findOne({
      phone: req.body.phone,
      password: req.body.password,
    });
    if (!customer || req.body.password != customer.password) {
      return res.status(400).json("Invalid Email/Password");
    }
    const token = generateAuthToken(
      res,
      customer._id,
      customer.name,
      "Customer"
    );
    token.then((value) => {
      customer.phoneToken = value;
    });
    // req.user = customer;
    customer.save();
    return res.status(200).redirect("/api/movies/movies");
  } catch (err) {
    console.log(err);
  }
};

exports.getCustomer = async (req, res) => {
  try {
    res.locals = {};
    let customer = await Customer.findOne({ phone: req.body.phone });
    if (customer) {
      return res.status(400).send("User already Exists");
    }
    customer = new Customer(
      _.pick(req.body, ["name", "email", "password", "phone"])
    );
    const token = await generateAuthToken(
      res,
      customer._id,
      customer.name,
      "Customer"
    );
    customer.phoneToken = token;
    customer.active = true;
    customer.isGold = false;
    // req.user = customer;
    // res.locals = customer;
    await customer.save();
    return res.status(200).redirect("/api/movies/movies");
  } catch (err) {
    console.log(err);
  }
};
