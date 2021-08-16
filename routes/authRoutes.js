// /api/auth/'route'
const express = require('express');
const router = express.Router();
const {userauth, customerauth} = require('../middleware/auth');
const { getUserfromdata, loginPage, 
   getUser, getCustomer, getCustomerfromData,
    loginPageCustomer,signupPage,
   signupPageCustomer,logoutUser,logoutCustomer
} = require('../controllers/authController');


router.get('/login', loginPage);
router.post('/loginData', getUserfromdata);


router.get('/loginCustomer', loginPageCustomer);
router.post('/customerlogin', getCustomerfromData);


router.get('/signupData', signupPage);
router.post('/signup', getUser);


router.get('/signupPage', signupPageCustomer);
router.post('/customersignup', getCustomer);

router.get('/logoutuser', userauth,logoutUser);
router.get('/logoutcustomer', logoutCustomer);

module.exports = router;
