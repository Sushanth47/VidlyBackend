const express = require('express');
const { getUser } = require('../controllers/userController');
const router = require('./rentals');

router.post('/getusers', getUser);

module.exports = router;
