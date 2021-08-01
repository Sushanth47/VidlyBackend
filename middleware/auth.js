require('dotenv').config();
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
   console.log(req.cookies);
   const token = req.cookies.token || '';
   try{
      console.log(token)
      if(!token) return res.status(401).json('access denied. No token Provided')
      const decoded = jwt.verify(token, process.env.jwtPrivateKey);
      req.user = decoded;
      console.log(req.user);
      next();
   }
   catch(ex){
      res.status(400).send('Invalid Token');
   }
}
