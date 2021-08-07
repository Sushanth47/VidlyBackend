require('dotenv').config();
const jwt = require('jsonwebtoken')
const { User } = require('../models/user');
const { Customer } = require('../models/customer');
// const db = require()

exports.userauth = async (req, res, next)=> {
   console.log(req.header);
   const token = req.cookies.token || '';
   try{
      console.log(token, 'token')
      if(!token) return res.status(401).json('access denied. No token Provided');
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      var fromUserModel = await User.findOne({name:decoded.name});
      fromUserModel.phoneToken = token
      req.user = fromUserModel;
      // req.user.isGold = 
      fromUserModel.save()
      // console.log(req.user);
      next();
   }
   catch(ex){
      res.status(400).send('Invalid Token');
   }
}


exports.customerauth = async(req, res)=>{
   console.log(req.header);
   const token = req.cookies.token || '';
   try{
      console.log(token, 'token')
      if(!token) return res.status(401).json('access denied. No token Provided');
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      var fromUserModel = await Customer.findOne({name:decoded.name});
      fromUserModel.phoneToken = token
      req.user = fromUserModel;
      // req.user.isGold = 
      fromUserModel.save()
      console.log(req.user);
      next();
   }
   catch(ex){
      res.status(400).send('Invalid Token');
   }
}