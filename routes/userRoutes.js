const express = require('express');
const {userauth, customerauth} = require('../middleware/auth')
const { getUser, meUser } = require('../controllers/userController');
const router = require('./rentals');

router.get('/me', userauth, meUser);




module.exports = router;
