const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = Promise

mongoose.
 connect(, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify: false,
         useUnifiedTopology: true
         })
.then(() =>console.log('DB connection successful'));


