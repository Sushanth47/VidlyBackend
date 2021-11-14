const express = require("express");
const router = express.Router();
const { checkauth, customerauth } = require("../middleware/auth");
const {
  rentalPage,
  checkout,
  rentalDisplay,
  billPage,
} = require("../controllers/rentalController");

router.get("/rentalpage", customerauth, rentalPage);

router.get("/bill", customerauth, billPage);

router.post("/checkout", customerauth, checkout, billPage);

router.get("/rentaldisplay", customerauth, rentalDisplay);

module.exports = router;
