require("dotenv").config();
var express = require("express");
var app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
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
const { Movie } = require("./models/movie");
var db = require("./models/index");
const port = process.env.PORT;

//Set and Use
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
// app.use(cors());
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
  console.log("Cookies: ", req.cookies);
  res.clearCookie();
  console.log("Signed Cookies: ");
});

app.get("/setrent", async (req, res) => {
  var movie = await Movie.find({});
  movie.forEach((list) => {
    list.dailyRentalRate = list.dailyRentalRate / 10;
    list.save();
  });
  return res.json("done ");
});

app.get("/webscrap", async (req, res) => {
  const movie = await Movie.find({}, "links");
  const rating = [];
  movie.forEach((list) => {
    axios(list.links)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $(".ipc-button__text", html).each(function () {
          const title = $(this).text();
          if (title && title.startsWith(".", 1)) {
            const i = title.indexOf("/");
            var rat = title.substr(0, i);
            list.imdbRating = rat;
            rating.push(rat);
          }
        });
      })
      .catch((err) => console.log(err));
    list.save();
  });

  setTimeout(function () {
    var unqiuevals = [...new Set(rating)];
    console.log(unqiuevals);
    // return res.json(rating);
  }, 5000);
  return res.json(rating);
});

app.get("/webscrapmoviedata", async (req, res) => {
  const movie = await Movie.find({});
  const rating = [];
  var unqiuevals = [];
  movie.forEach((list) => {
    axios(list.links)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $(".ipc-metadata-list__item", html).each(function () {
          const title = $(this).text();
          if (title) {
            // if (title.startsWith("Director")) {
            //   const director = title.substr(8, 25);
            //   list.director = director;

            //   //  uniquevals
            // }

            // if (title.startsWith("Runtime")) {
            //   const runtime = title.substr(7, title.length);
            //   list.runtime = runtime;
            // }
            // if (title.startsWith("Certificate")) {
            //   const certificate = title.substr(11, title.length);
            //   list.mpAARating = certificate;
            // }
            // if (title.startsWith("Release date")) {
            //   const releasedate = title.substr(12, title.length);
            //   list.releaseDate = releasedate;
            //   console.log(releasedate);
            // }
            if (title.startsWith("Gross worldwide")) {
              const i = title.indexOf("$");
              const gross = title.substr(i, title.length);
              list.worldwide = gross;
            }
            // if (title.startsWith("Aspect ratio")) {
            //   const gross = title.substr(12, title.length);
            //   list.aspectRatio = gross;
            //   // unqiuevals = [...new Set(rating)];
            // }
          }
        });
      })
      .catch((err) => console.log(err));
    setTimeout(function () {
      // unqiuevals = [...new Set(rating)];
      // console.log(unqiuevals);
      list.save();
    }, 5000);
  });

  return res.json(rating);
});

app.get("/rentedcustomers", async (req, res) => {
  await Movie.updateMany(
    {},
    {
      $set: {
        // director: "",
        // mpAARating: "",
        // awards: "",
        // runtime: "",
        // aspectRatio: "",
        // releaseDate: "",
        worldwide: "",
      },
    }
  );
  return res.json("done");
});

//404 Page
// app.all('*', (req, res, next) =>{
//    res.render('404');
// });

//PORT
app.listen(port, "0.0.0.0", () => console.log(`Hello to ${port}`));
