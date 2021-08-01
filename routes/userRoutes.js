const express = require('express');
const isAdmin = require('../middleware/auth')
const { getUser, meUser } = require('../controllers/userController');
const router = require('./rentals');

router.get('/me', isAdmin, meUser);




module.exports = router;
