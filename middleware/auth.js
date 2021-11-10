require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Customer } = require("../models/customer");

exports.checkauth = async (req, res, next) => {
  // console.log(req);
  // const obj = JSON.parse(JSON.stringify(req.cookies));
  const checkstring = JSON.stringify(req.cookies);
  // console.log(typeof checkstring, "cs");
  // console.log(obj, "obj");
  if (checkstring == "{}") {
    req.user = { subject: "Guest", genres: [] };
    res.locals.currentUser = req.user;
    next();
  } else {
    if (req.cookies.token.subject == "User") {
      await userauth(req, res);
      next();
    } else if (req.cookies.token.subject == "Customer") {
      await customerauth(req, res);
      next();
    }
  }
};

async function userauth(req, res, next) {
  const token = req.cookies.token.token;
  try {
    if (!token) return res.status(409).render("./404");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    if (decoded.subject == "User") {
      // console.log(decoded, "decoded");
      req.user = decoded;
      res.locals.currentUser = req.user;
      // console.log(req.user, "authcheck");
    } else {
      return res.status(409).render("./404");
    }
    // next();
  } catch (ex) {
    res.status(400).render("404");
    console.log(ex);
  }
}

exports.userauth = async function (req, res, next) {
  try {
    const token = req.cookies.token.token;
    if (!token) return res.status(409).render("./404");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    if (decoded.subject == "User") {
      req.user = decoded;
      res.locals.currentUser = req.user;
    } else {
      return res.status(409).render("./404");
    }
    next();
  } catch (ex) {
    res.status(404).render("404");
    console.log(ex);
  }
};

exports.newauth = async (req, res, next) => {
  if (req.cookies.token) {
    if (req.cookies.token.token) {
      req.guest = false;
    }
  } else {
    console.log("reqguesttrue");
    req.guest = true;
    // res.render('../views/partials/header');
  }
  next();
};

async function customerauth(req, res, next) {
  const token = req.cookies.token.token;
  try {
    if (!token)
      return res.status(409).render("access denied. No token Provided");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    if (decoded.subject == "Customer") {
      var fromUserModel = await Customer.findOne({ _id: decoded._id });
      req.user = decoded;
      // res.locals.subject = 'Customer'
      res.locals.currentUser = req.user;
      // req.user.isGold =
      fromUserModel.save();
      // console.log(req.user);
      // next();
    } else {
      return res.render("404");
    }
  } catch (ex) {
    console.log(ex);
    res.clearCookie("token");
    // res.status(400).render("401");
  }
}

exports.customerauth = async function (req, res, next) {
  try {
    const token = req.cookies.token.token;

    if (!token) return res.status(404).render("404");
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    console.log(decoded);
    if (decoded.subject == "Customer") {
      var fromUserModel = await Customer.findOne({ _id: decoded._id });
      req.user = decoded;
      res.locals.currentUser = req.user;
      fromUserModel.save();
      next();
    } else if (decoded.subject == "User") {
      return res.status(404).render("404");
    } else {
      return res.status(409).json("access denied. No token Provided");
    }
  } catch (ex) {
    console.log(ex);
    res.status(404).render("404");
  }
};
