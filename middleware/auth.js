require('dotenv').config();
const jwt = require('jsonwebtoken')
const { User } = require('../models/user');
const { Customer } = require('../models/customer');
// const db = require()



exports.checkauth = async(req, res, next)=>{
   if(!req.cookies.token){
      console.log('hey');
      req.user = {name:'Guest'}
   }else{
      if(req.cookies.token.subject == 'User'){
         // req.user.subject = 'User'
         console.log('User');
         userauth(req, res);
         
      }else if(req.cookies.token.subject == 'Customer'){
         // req.user.subject = 'Customer'
         console.log('Customer');
         console.log(req.cookies.token);
         customerauth(req, res);
      }
   }
  
}

 exports.userauth = async function(req, res, next) {
    console.log(req.cookies.token)
   const token = req.cookies.token.token || '';
   try{
      if(!token) return res.status(401).render('./401');
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      var fromUserModel = await User.findOne({name:decoded.name});
      req.user = fromUserModel;
      res.locals.subject = 'User'
      console.log(req.user, 'req.user');

      res.locals.fromUserModel = fromUserModel;
      fromUserModel.save()  
      next()
   }
   catch(ex){
      res.status(400).render('401');
      console.log(ex);
   }
}


 exports.customerauth = async function(req, res, next){
   const token = req.cookies.token.token || '';
   try{
      // console.log(token, 'token')
      if(!token) return res.status(401).json('access denied. No token Provided');
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      var fromUserModel = await Customer.findOne({name:decoded.name});
      req.user = fromUserModel;
      res.locals.subject = 'Customer'
      res.locals.fromUserModel = fromUserModel;
      // req.user.isGold = 
      fromUserModel.save()
      console.log(req.user);
      next()
   }
   catch(ex){
      console.log(ex);
      res.status(400).render('401');
   }
}

