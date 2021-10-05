// const {Customer, validate} = require('../models/customer')
const express = require("express");
const router = express.Router();
const {
  getRentals,
  pullFromCart,
  pullFromList,
  getWishlist,
  getMyCart,
} = require("../controllers/customerController");
const { customerauth, checkauth } = require("../middleware/auth");
// const { signup } = require('../controllers/authController');

router.get("/getWishlist", customerauth, getWishlist);

router.get("/getMyCart", customerauth, getMyCart);

router.get("/pullfromcart/:movieId", customerauth, pullFromCart);

router.get("/pullfromlist/:movieId", customerauth, pullFromList);

router.get("/getrentals", customerauth, getRentals);

module.exports = router;

//In Controllers
