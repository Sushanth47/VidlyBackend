require('dotenv').config()
var express = require('express');
var app = express();
const cookieParser = require('cookie-parser');
// var session = require('express-session')
var flash = require('req-flash');
const cors = require('cors');
const mongoose = require('mongoose');
// const {mongoClient} = require
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals');
const movies = require('./routes/movies');
const home = require('./routes/home');
const users = require('./routes/userRoutes');
const auth = require('./routes/authRoutes');
const {userauth, customerauth} = require('./middleware/auth');
const { User } = require('./models/user');
const { Customer } = require('./models/customer');
const { Genre } = require('./models/genre');
//MongoDB Connections
const port = process.env.PORT || 3031;
const password = 'vidlybackend'
const dbURI = 'mongodb+srv://vidlybackend:'+password+'@cluster0.eyaim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(dbURI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex:true
})
 .then(()=>app.listen(port, '0.0.0.0',() => console.log(`Hello to ${port}`)))
 .catch((err)=>console.error(err));

//Set and Use
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static());
app.use(express.static( __dirname+'public'));
app.use(cookieParser());
// app.use(session({ 
//    saveUninitialized:true,
//    resave:true,
//    secret:'123'
//  }));
// app.use(flash());

// app.use(function (req, res, next){
//    res.locals.success = req.flash('success');
//    res.locals.error = req.flash('error');
//    next()
// })

app.use(
   cors({})
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
   var auth = await Customer.find({});
   auth.forEach(list=>{
      list.phoneToken = "N/A";
      list.save();
   })
   return res.status(200).json("done")
})

app.get('/guestdetails', async(req, res)=>{
   // const loc = navigator.geolocation;
   console.log(req.headers['user-agent']);
   
   console.log(req.connection.remoteAddress);
   return res.status(200).json('done')
})

app.post('/addgenre', async(req, res)=>{
   console.log(req.body);
   var obj = {
      name:req.body.genre
   };
   await Genre.create(obj);
   return res.status(200).json({message:`Genre Added ${req.body.genre}`});
})

app.get('/genremodel', async(req, res)=>{
   var model = await Genre.find({});
   model.forEach(list=>{
      list.img="";
      list.description="";
      list.save();
   })
   return res.json('done');
   
})

app.get('/cookie', userauth,function (req, res) {
   // Cookies that have not been signed
   console.log('Cookies: ', req.cookies)
   res.clearCookie()
   // Cookies that have been signed
   console.log('Signed Cookies: ', )
 })

//404 Page
app.all('*', (req, res, next) =>{
   res.render('404');
});


//PORT
