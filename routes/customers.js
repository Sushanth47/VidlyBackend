const express = require("express");
const router = express.Router();
const {
  getRentals,
  pullFromCart,
  pullFromList,
  giveReview,
  ApplyGold,
  applyGold,
  getWishlist,
  getMyCart,
} = require("../controllers/customerController");
const { customerauth, checkauth } = require("../middleware/auth");

router.get("/getWishlist", customerauth, getWishlist);

router.get("/getMyCart", customerauth, getMyCart);

router.get("/pullfromcart/:movieId", customerauth, pullFromCart);

router.get("/pullfromlist/:movieId", customerauth,pullFromList);

router.get("/getrentals", customerauth, getRentals);

router.post("/getreview", customerauth, giveReview);

router.post("/goldapp", customerauth, ApplyGold);

router.get("/goldpage", customerauth, applyGold);

module.exports = router;
