// const {Customer, validate} = require('../models/customer')
const express = require("express");
const router = express.Router();
const {
  updateCustomers,
  deleteCustomer,
  getSpecificCustomer,
  getWishlist,
  getMyCart,
} = require("../controllers/customerController");
const { customerauth, checkauth } = require("../middleware/auth");
// const { signup } = require('../controllers/authController');

router.get("/getWishlist", customerauth, getWishlist);

router.get("/getMyCart", customerauth, getMyCart);

module.exports = router;

//In Controllers
