const express = require("express");
const router = express.Router();
const { checkauth, customerauth } = require("../middleware/auth");
const { rentalPage, checkout } = require("../controllers/rentalController");

router.get("/rentalpage", customerauth, rentalPage);

router.get("/checkout", customerauth, checkout);

module.exports = router;
