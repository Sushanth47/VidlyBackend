const mongoose = require('mongoose');

// mongoose.set('debug', true);
// mongoose.Promise = Promise

// mongoose.
//  connect(, {
//          useNewUrlParser: true,
//          useCreateIndex: true,
//          useFindAndModify: false,
//          useUnifiedTopology: true
//          })
// .then(() =>console.log('DB connection successful'));

module.exports.Customer = require('./customer');
module.exports.Genre = require('./genre');
module.exports.Movie = require('./movie');
module.exports.Rental = require('./rental');
module.exports.RequestedModel = require('./requestedModel');
module.exports.User = require('./user');
