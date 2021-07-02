var express = require('express');
var app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const movies = require('./routes/movies')
const home = require('./routes/home')
const router = express.Router();
//MongoDB Connections
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(()=>console.log('Connected to The Database'))
 .catch((err)=>console.error(err));

//Set and Use
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//Routes
app.use('/', home);
app.use('/api/genres', genres)
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies)

router.all('*', (req, res, next) =>{
   res.render('404');
});
  
const port = process.env.PORT || 3031;
app.listen(port, () => console.log(`Hello to ${port}`));
