require('dotenv').config();
const jwt = require('jsonwebtoken')
const { User } = require('../models/user');
const { Customer } = require('../models/customer');
// const db = require()

exports.guestauth = async(req, res, next)=>{
   const expiration = 604800000;
   var token = req.headers['user-agent'];
   res.cookie('guestToken', token, {
      expires: new Date(Date.now() + expiration),
   });
   res.locals.subject="Guest"   
   next();
}

exports.checkauth = async(req, res, next)=>{
   // console.log(req.cookies);
   if(!req.cookies.token){
      console.log('hey');
   }else{
      if(req.cookies.token.subject == 'User'){
         
      }
   }
   next()
}

exports.userauth = async (req, res, next)=> {
   const token = req.cookies.token || '';
   try{
      if(!token) return res.status(401).render('./401');
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      var fromUserModel = await User.findOne({name:decoded.name});
      req.user = fromUserModel;
      res.locals.subject = 'User'
      console.log(req.user.name, 'req.user');
      res.locals.fromUserModel = fromUserModel;
      fromUserModel.save()
     
      next();
   }
   catch(ex){
      res.status(400).render('401');
      console.log(ex);
   }
}


exports.customerauth = async(req, res, next)=>{
   console.log(req.header);
   const token = req.cookies.token || '';
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
      next();
   }
   catch(ex){
      console.log(ex);
      res.status(400).render('401');
   }
}

