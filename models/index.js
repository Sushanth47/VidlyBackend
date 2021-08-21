const mongoose = require('mongoose');

const password = 'vidlybackend'

const dbURI = 'mongodb+srv://vidlybackend:vidlybackend@cluster0.eyaim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.set('debug', true);
mongoose.Promise = Promise


mongoose.
 connect(dbURI, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify: false,
         useUnifiedTopology: true
         })
.then(() =>console.log('DB connection successful'))
.catch((err)=>console.log(err));



module.exports.Customer = require('./customer');
module.exports.Genre = require('./genre');
module.exports.Movie = require('./movie');
module.exports.Rental = require('./rental');
module.exports.RequestedModel = require('./requestedModel');
module.exports.User = require('./user');
