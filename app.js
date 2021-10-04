require("dotenv").config();
var express = require("express");
var app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const movies = require("./routes/movies");
const home = require("./routes/home");
const users = require("./routes/userRoutes");
const auth = require("./routes/authRoutes");
const { userauth, checkauth } = require("./middleware/auth");
const { User } = require("./models/user");
const { Customer } = require("./models/customer");
const { Genre } = require("./models/genre");

var db = require("./models/index");
const port = process.env.PORT;

//Set and Use
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(express.static(__dirname + "public"));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.user, 'requserinappjs')
  next();
});

app.use(cors({}));

//Routes
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/users", users);
app.use("/api/rentals", rentals);
app.use("/api/movies", movies);
app.use("/api/auth", auth);

//Some Direct Routes

app.get("/phonetoken", async (req, res) => {
  var auth = await Customer.find({});
  auth.forEach((list) => {
    list.phoneToken = "N/A";
    list.save();
  });
  return res.status(200).json("done");
});

app.get("/getallmoviestest", async (req, res) => {
  var mov = await db.Customer.find({});
  // console.log(v);
  return res.json(mov);
});


app.post("/addgenre", async (req, res) => {
  console.log(req.body);
  var obj = {
    name: req.body.genre,
  };
  await Genre.create(obj);
  return res.status(200).json({ message: `Genre Added ${req.body.genre}` });
});

app.get("/addimages", async (req, res) => {
  var img = await User.find({}, "imgs");
  img.forEach((list) => {
    list.imgs.push(req.body.photo);
    list.save();
  });
  return res.status(200).json("done");
});

app.get("/genremodel", async (req, res) => {
  var model = await Genre.find({});
  model.forEach((list) => {
    list.img = "";
    list.description = "";
    list.save();
  });
  return res.json("done");
});

app.get("/cookie", checkauth, function (req, res) {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);
  res.clearCookie();
  // Cookies that have been signed
  console.log("Signed Cookies: ");
});

//404 Page
// app.all('*', (req, res, next) =>{
//    res.render('404');
// });

//PORT
app.listen(port, "0.0.0.0", () => console.log(`Hello to ${port}`));
