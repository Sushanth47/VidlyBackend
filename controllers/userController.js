require('dotenv').config( )

// const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');


exports.meUser = async(req, res, next) =>{
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
}



