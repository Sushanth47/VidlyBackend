require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const cookieParser = require('cookie-parser');
const { Customer } = require('../models/customer');


async function generateAuthToken(res, _id, name){
   const expiration = 604800000;
  const token = jwt.sign(
    {_id: _id, name: name},
  process.env.jwtPrivateKey,
  {
    expiresIn:process.env.DB_ENV === 'testing' ? '1d': '7d'
    
  });
  return res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
  })
}


exports.loginPage = async(req, res)=>{
   var type="userLogin";
   console.log(req.user, 'req.user');
   return res.status(200).render('./loginPage.ejs', {type:type})
}

exports.signupPage = async(req, res)=>{
   var type="userLogin";
   return res.status(200).render('./signupPage', {type:type});
}

exports.signupPageCustomer = async(req, res)=>{
   var type="customerLogin";
   return res.status(200).render('./signupPage', {type:type});
}

exports.loginPageCustomer = async(req, res)=>{
   var type="customerLogin";
   return res.status(200).render('./loginPage.ejs', {type:type});
}

exports.getUser = async(req, res)=>{
   let user = await User.findOne({email:req.body.email});
   if (user) return res.status(400).send('User already registered');
   user = new User(_.pick(req.body, ['name', 'email', 'password'])); 
   
   const token = generateAuthToken(res, user._id, user.name);
   user.phoneToken = token.cookies;
   user.active = true;
   req.user = user
   await user.save();
   res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
}

exports.getUserfromdata = async(req, res)=>{
   let user = await User.findOne({email:req.body.email});
   // console.log(user);
   if (!user || req.body.password != user.password){ 
      // return req.flash('errorMessage', 'Invalid Credentials')
      return res.status(400).send('Invalid Email/Password');
   }
   const token = generateAuthToken(res, user._id, user.name);
   // user.phoneToken = token;
   user.active = true;
   req.user = user;
   console.log(req.user);
   // req.user.save();
   user.save();
   return res.status(200).redirect('/api/movies/movies');
}

exports.logoutUser = async(req, res)=>{
   // console.log(req.user, 'userhere');
   var userfind = await User.findOne({_id:req.user._id});
   userfind.active = false;
   userfind.save();
   // console.log(res.cookies, 'cookies here');
   res.clearCookie('token');
   console.log('======================================================')
return res.status(200).redirect('/api/movies/movies')
}

exports.logoutCustomer = async(req, res)=>{
   var customerfind = await Customer.findOne({_id:req.user._id});
   customerfind.active = false;
   customerfind.save();
   res.clearCookie('token')
   return res.status(200).redirect('/api/movies/movies'); 
}

exports.getCustomerfromData = async(req, res)=>{
   var customer = await Customer.findOne({phone:req.body.phone});
   if(!customer || req.body.password!=customer.password){
      return res.status(400).send('Invalid Email/Password');
   }
   const token = generateAuthToken(res, customer._id, customer.name);
   customer.phoneToken = token.cookies;
   req.user = customer;
   customer.save();
   return res.status(200).redirect('/api/movies/movies');
}

exports.getCustomer = async(req, res)=>{
   let customer = await Customer.findOne({phone:req.body.phone});
   if(customer) return res.status(400).send('User already Exists');
   customer = new Customer(_.pick(req.body, ['name', 'email', 'password', 'phone']));

   const token = generateAuthToken(res, customer._id, customer.name);

   customer.phoneToken = token.cookies;
   customer.active = true;
   customer.isGold = false;
   req.user = customer
   // req.user.sa
   await customer.save();
   // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
   return res.status(200).redirect('/api/movies/movies');
   
}



function validate(req){
   const schema = Joi.object({
       email:Joi.string().min(3).required().email(),
       password: Joi.string.min(3).required()
     });
   return schema.validate(user);
}
