const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');


exports.getUser = async(req, res)=>{
   let user = await User.findOne({email:req.body.email});
   if (user) return res.status(400).send('User already registered');
   user = new User(_.pick(req.body, ['name', 'email', 'password'])); 


   await user.save();
   res.send(_.pick(user, ['_id', 'name', 'email']));
}

