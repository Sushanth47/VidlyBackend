const express = require("express");
const { userauth, customerauth, checkauth } = require("../middleware/auth");
const { getUser, meUser } = require("../controllers/userController");
const router = require("./rentals");

router.get("/me", checkauth, meUser);

module.exports = router;
