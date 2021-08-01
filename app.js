require('dotenv').config()
var express = require('express');
var app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const movies = require('./routes/movies')
const home = require('./routes/home')
const users = require('./routes/userRoutes');
const auth = require('./routes/authRoutes');
const middlemass = require('./middleware/auth');
const { User } = require('./models/user');
//MongoDB Connections
mongoose.connect('mongodb://localhost/vidly', {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex:true
})
 .then(()=>console.log('Connected to The Database'))
 .catch((err)=>console.error(err));

//Set and Use
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(
   cors({
     origin: [
       'http://localhost:6969',
     ],
     credentials: true
   })
 );

//Routes
app.use('/', home);
app.use('/api/genres', genres)
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies)
app.use('/api/auth', auth);

//Some Direct Routes
app.get('/phonetoken', async(req, res)=>{
   var auth = await User.find({});
   auth.forEach(list=>{
      list.phoneToken = "N/A";
      list.save();
   })
   return res.status(200).json("done")
})

app.get('/cookie', middlemass,function (req, res) {
   // Cookies that have not been signed
   console.log('Cookies: ', req.cookies)
  
   // Cookies that have been signed
   console.log('Signed Cookies: ', req.signedCookies)
 })

//404 Page
app.all('*', (req, res, next) =>{
   res.render('404');
});


//PORT
const port = process.env.PORT || 3031;
app.listen(port, () => console.log(`Hello to ${port}`));
