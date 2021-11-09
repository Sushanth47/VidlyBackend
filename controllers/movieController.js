require("dotenv").config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Movie } = require("../models/movie");
const { Requested } = require("../models/requestedModel");
const { Genre } = require("../models/genre");
const { Customer } = require("../models/customer");

exports.getMovies = async (req, res) => {
  try {
    // console.log(req.cookies);
    const perPage = 10;
    const page = req.query.pageNo;
    const movieCount = await Movie.countDocuments();
    var name = "";
    if (req.user) {
      name = req.user.name;
    }
    const movies = await Movie.aggregate([
      {
        $project: {
          title: 1,
          year: 1,
          img: 1,
          genreId: 1,
          dailyRentalRate: 1,
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: perPage * (page - 1),
      },
      {
        $limit: perPage,
      },
    ]);
    // console.log(movies);
    return res.status(200).render("./movies", {
      movies: movies,
      url: process.env.WEBURL,
      movieCount: movieCount,
      perPage: perPage,
      name: name,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMoviesSort = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.query.pageNo;
    const movieCount = await Movie.countDocuments();
    var name = "";
    if (req.user) {
      name = req.user.name;
    }
    if (req.body.sortBy == "Name") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            genreId: 1,
            year: 1,
          },
        },
        {
          $sort: { title: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Year") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,
            year: 1,
          },
        },
        {
          $sort: { year: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Rank") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,
            rank: 1,

            year: 1,
          },
        },
        {
          $sort: { rank: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "IMDb") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,

            imdbRating: 1,
          },
        },
        {
          $sort: { imdbRating: -1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Price") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,

            dailyRentalRate: 1,
          },
        },
        {
          $sort: { dailyRentalRate: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Availability") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,
            numberInStock: 1,
            dailyRentalRate: 1,
          },
        },
        {
          $sort: { numberInStock: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Popularity") {
      var movies = await Movie.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,

            rentedCustomers: 1,

            requestCount: 1,
          },
        },
        {
          $sort: { rentedCustomers: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Genre") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,

            genre: 1,
          },
        },
        {
          $sort: { genre: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    } else if (req.body.sortBy == "Runtime") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            genreId: 1,

            year: 1,
            runtime: 1,
            genre: 1,
          },
        },
        {
          $sort: { runtime: -1 },
        },
        {
          $skip: perPage * (page - 1),
        },
      ]);
    }
    return res.status(200).render("./movies", {
      movies: movies,
      movieCount: movieCount,
      perPage: perPage,
      name: name,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  try {
    await Customer.updateOne(
      { _id: req.user._id },
      { $addToSet: { cart: req.params.movieId } }
    );
    return res.status(200).redirect(`/api/movies/${req.params.movieId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.getSpecificMovie = async (req, res) => {
  let customerId = "";
  let customer = {};
  if (req.cookies.token) customerId = req.cookies.token._id;
  if (customerId.length != 0) {
    customer = await Customer.findOne({ _id: customerId }, "rentedMovies");
  } else {
    customer.rentedMovies = [];
  }

  var movie = await Movie.aggregate([
    {
      $match: { _id: ObjectId(req.params.mid) },
    },
    {
      $lookup: {
        from: "genres",
        localField: "genreId",
        foreignField: "_id",
        as: "thegenres",
      },
    },
    {
      $unwind: "$thegenres",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        img: 1,
        genreId: 1,
        rank: 1,
        cast: 1,
        year: 1,
        links: 1,
        numberInStock: 1,
        dailyRentalRate: 1,
        iReviewed: { $in: ["$_id", customer.rentedMovies] },
        ismovieCreated: 1,
        director: 1,
        aspectRatio: 1,
        requestCount: 1,
        genre: 1,
        worldwide: 1,
        imdbRating: 1,
        runtime: 1,
        mpAARating: 1,
        thegenres: 1,
      },
    },
  ]);
  var tester = await Movie.findOne({ _id: req.params.mid }, "genreId").populate(
    "genreId"
  );
  var rgenres = [];
  tester.genreId.forEach((list) => {
    rgenres.push(list.name);
  });
  var otherMovies = await Movie.find(
    {
      _id: { $nin: [req.params.mid] },
    },
    "_id title rank cast year img links dailyRentalRate director genreId"
  ).populate("genreId");
  var othermovies = [];
  otherMovies.forEach((list) => {
    for (var i = 0; i < tester.genreId.length; i++) {
      list.genreId.forEach((lost) => {
        if (lost._id.toString() == tester.genreId[i]._id.toString()) {
          othermovies.push(list);
        }
      });
    }
  });
  // var a = [1, 1, 2];

  var p = [...new Set(othermovies)];
  // console.log(p);
  // array_splice($p, 0, 5);
  p.splice(0, 5);
  return res
    .status(200)
    .render("./moviePage.ejs", { movie: movie[0], otherMovies: p, rgenres });
};

exports.addToWishlist = async (req, res) => {
  try {
    var cust = await Customer.updateOne(
      { _id: req.user._id },
      { $addToSet: { wishList: req.params.movieId } }
    );
    return res.status(200).redirect("/api/movies/" + req.params.movieId + "/");
  } catch (err) {
    console.log(err);
  }
};

exports.createMovies = async (req, res) => {
  try {
    var str = req.body.genreName;
    var myarray = str.split(",");
    var genrearr = [];

    for (var i = 0; i < myarray.length; i++) {
      console.log(myarray[i]);
      const genre = await Genre.findOne(
        {
          name: { $regex: myarray[i], $options: "$i" },
        },
        "_id name"
      );
      if (!genre) res.status(400).json("Invalid Genre");
      genrearr.push(genre);
    }
    console.log(genrearr);
    const movieadd = req.body.title;
    const checkmovie = await Movie.findOne({
      title: { $regex: req.body.title, $options: "$i" },
    });
    if (checkmovie) return res.status(409).send("Movie already exists");
    var axios = require("axios").default;
    const cheerio = require("cheerio");
    await Requested.findOneAndUpdate(
      { title: { $regex: req.body.title, $options: "$i" } },
      { ismovieCreated: true }
    );
    var options = {
      method: "GET",
      url: "https://imdb8.p.rapidapi.com/auto-complete",
      params: { q: movieadd },
      headers: {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": process.env.API_HOST,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        var apidata = response.data;
        let newarr = [];
        apidata.d.forEach((list) => {
          if (list.q) {
            if (list.q == "feature") {
              newarr.push(list);
            }
          }
        });
        var genreobject = [];
        console.log(genrearr);
        genrearr.forEach((list) => {
          // console.log(list);
          genreobject.push(list._id);
        });
        let movie = new Movie({
          title: newarr[0].l,
          genreId: genreobject,
          year: newarr[0].y,
          img: newarr[0].i.imageUrl,
          links: "https://www.imdb.com/title/" + newarr[0].id + "/",
          cast: newarr[0].s,
          rank: newarr[0].rank,
          // genre: genre.name,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
          ismovieCreated: true,
        });
        var newrat = "";
        var direcTor = "";
        var mpAA = "";
        var runTime = "";
        var ratio = "";
        var worldwide = "";
        axios(movie.links).then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          $(".ipc-button__text", html).each(function () {
            const title = $(this).text();
            if (title && title.startsWith(".", 1)) {
              const i = title.indexOf("/");
              var rat = title.substr(0, i);
              if (!movie.imdbRating) newrat = rat;
            }
          });
          $(".ipc-metadata-list__item", html).each(function () {
            const title = $(this).text();
            if (title) {
              if (title.startsWith("Director")) {
                const director = title.substr(8, 25);
                direcTor = director;
              }

              if (title.startsWith("Runtime")) {
                const runtime = title.substr(7, title.length);
                runTime = runtime;
              }
              if (title.startsWith("Certificate")) {
                const certificate = title.substr(11, title.length);
                mpAA = certificate;
              }
              if (title.startsWith("Gross worldwide")) {
                const i = title.indexOf("$");
                const gross = title.substr(i, title.length);
                worldwide = gross;
              }
              if (title.startsWith("Aspect ratio")) {
                const rattio = title.substr(12, title.length);
                ratio = rattio;
              }
            }
          });
        });
        setTimeout(function () {
          movie.imdbRating = newrat;
          movie.director = direcTor;
          movie.runtime = runTime;
          movie.aspectRatio = ratio;
          if (mpAA == "Not Rated") {
            movie.mpAARating = "A";
          } else {
            movie.mpAARating = mpAA;
          }
          movie.worldwide = worldwide;
          movie.save();
          res.status(200).redirect(`/api/movies/createmovies`);
        }, 5000);
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.requestedMoviePage = async (req, res) => {
  try {
    var customer = await Customer.findOne(
      { _id: req.user._id },
      "rentedMovies wishList cart"
    )
      .populate("rentedMovies", "genre")
      .populate("wishList", "genre")
      .populate("cart", "genre");

    var genresCustomer = [];

    for (var i = 0; i < customer.rentedMovies.length; i++) {
      genresCustomer.push(customer.rentedMovies[i].genre);
    }
    for (var i = 0; i < customer.cart.length; i++) {
      genresCustomer.push(customer.cart[i].genre);
    }
    for (var i = 0; i < customer.wishList.length; i++) {
      genresCustomer.push(customer.wishList[i].genre);
    }
    // console.log(genresCustomer);
    const uniquegenres = [...new Set(genresCustomer)];
    // console.log(uniquegenres);
    var movies = await Movie.aggregate([
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $unwind: "$genre",
      },
      {
        $match: { genre: { $in: uniquegenres } },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          img: 1,
          genreId: 1,
          rank: 1,
          cast: 1,
          year: 1,
          links: 1,
          numberInStock: 1,
          dailyRentalRate: 1,
          rentedCustomers: 1,
          ismovieCreated: 1,
          requestCount: 1,
          genre: 1,
          imdbRating: 1,
          director: 1,
        },
      },
    ]);
    // console.log(movies, "movies");
    return res.status(200).render("./requestMovie", { movies });
  } catch (err) {
    console.log(err);
  }
};

exports.requestedMovie = async (req, res) => {
  try {
    var requestedCheck = await Requested.find({
      title: { $regex: req.body.title, $options: "$i" },
    });
    const movie = await Movie.findOne({
      title: { $regex: req.body.title, $options: "$i" },
    });
    if (movie) {
      if (movie.numberInStock == 0) {
        return res
          .status(200)
          .send(
            "The Movie is currently out of Stock. We have getting it asap as possible!"
          );
      } else {
        return res.status(409).send("movie already exists");
      }
    }
    if (requestedCheck.length > 0) {
      requestedCheck.forEach((list) => {
        list.requestCount += 1;
        list.save();
      });
      return res
        .status(409)
        .json(
          "Movie Already Requested. We are working on Bringing it to your nearest stores asap as possible!"
        );
    } else {
      let requested = new Requested({
        title: req.body.title,
        requestCount: 1,
      });
      requested.save();
      return res.status(200).redirect("/api/movies/requestMovie");
    }
  } catch (err) {
    console.log(err);
    // return res.status(200).json(err);
  }
};

exports.createMoviesPage = async (req, res) => {
  let movie = await Movie.find({}).populate("genreId");
  const allGenres = await Genre.aggregate([
    {
      $project: {
        name: 1,
      },
    },
  ]);
  return res
    .status(200)
    .render(`./createmovies`, { movie: movie, allGenres: allGenres });
};

exports.displayMovie = async (req, res) => {
  var movie = await Movie.find({
    title: { $regex: req.query.title, $options: "$i" },
  }).populate("genreId");
  var genresearch = await Genre.findOne(
    {
      name: { $regex: req.query.title, $options: "$i" },
    },
    "_id"
  );
  // console.log(genresearch);
  var genreSearch = [];

  var moviesearch = await Movie.find(
    {},
    "cast _id, img year title director imdbRating genreId dailyRentalRate "
  ).populate("genreId");
  moviesearch.forEach((list) => {
    list.genreId.forEach((lost) => {
      if (lost._id.toString() == genresearch._id.toString()) {
        genreSearch.push(list);
      }
    });
  });
  // console.log(genreSearch);
  let genre = await Genre.find({
    name: { $regex: req.query.title, $options: "$i" },
  });
  return res.status(200).render("./searchResultsPage.ejs", {
    movie: movie,
    genre: genre,
    title: req.query.title,
    genresearch: genreSearch,
  });
};
