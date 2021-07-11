const express = require('express');
const router = express.Router();
const { getUserfromdata } = require('../controllers/authController');

router.post('/login', getUserfromdata);


module.exports = router;
