var express = require('express');
var app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const home = require('./routes/home')

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(()=>console.log('Connected to Db'))
 .catch((err)=>console.error(err));
app.set('view engine', 'pug');
app.set('views', './views'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static('public'));

app.use('/api/genres', genres)
app.use('/api/customers', customers);

app.use('/', home);

//port
  
const port = process.env.PORT || 3031;
app.listen(port, () => console.log(`Hello to ${port}`));