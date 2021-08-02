const express = require('express');
const router = express.Router();
const middlemass = require('../middleware/auth');
const { getUserfromdata, loginPage, 
   getUser, getCustomer, getCustomerfromData,
    loginPageCustomer,signupPage,
   signupPageCustomer,logOut
} = require('../controllers/authController');


router.get('/login', loginPage);
router.post('/loginData', getUserfromdata);


router.get('/loginCustomer', loginPageCustomer);
router.post('/customerlogin', getCustomerfromData);


router.get('/signupData', signupPage);
router.post('/signup', getUser);


router.get('/signupPage', signupPageCustomer);
router.post('/customersignup', getCustomer);

router.get('/logout', middlemass, logOut)

module.exports = router;
