const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');


exports.getUserfromdata = async(req, res)=>{
   let user = await User.findOne({email:req.body.email});
   console.log(user);
   if (!user) return res.status(400).send('Invalid Email/Password');
   
   // const validpassword = await bcrypt.compare(req.body.password, user.password);
   // if(!validpassword) return res.status(400).send('Invalid Email/Password');
   if(req.body.password != user.password){
      return res.status(400).send('Invalid Email/Password')
   }

   res.send(true);
}

function validate(req){
   const schema = Joi.object({
       email:Joi.string().min(3).required().email(),
       password: Joi.string.min(3).required()
     });
   return schema.validate(user);
}