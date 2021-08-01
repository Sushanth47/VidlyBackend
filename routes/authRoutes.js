const express = require('express');
const router = express.Router();
const middlemass = require('../middleware/auth');
const { getUserfromdata, loginPage, getUser, getCustomer, getCustomerfromData } = require('../controllers/authController');

router.post('/loginData', getUserfromdata);

router.get('/login', loginPage);

router.post('/signup', getUser);
router.post('/customerlogin', getCustomerfromData);
router.post('/customersignup', getCustomer);


module.exports = router;
