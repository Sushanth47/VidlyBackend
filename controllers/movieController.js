require("dotenv").config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Movie } = require("../models/movie");
const { Requested } = require("../models/requestedModel");
const { Genre } = require("../models/genre");
const { Customer } = require("../models/customer");

exports.getMovies = async (req, res) => {
  try {
    const perPage = 15;
    const page = req.query.pageNo;
    const movieCount = await Movie.countDocuments();
    const movies = await Movie.aggregate([
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
        $project: {
          title: 1,
          year: 1,
          img: 1,
          genreId: 1,
          dailyRentalRate: 1,
          genre: 1,
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
    return res.status(200).render("./movies", {
      movies: movies,
      url: process.env.WEBURL,
      movieCount: movieCount,
      perPage: perPage,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMoviesSort = async (req, res) => {
  try {
    const perPage = 15;
    const page = req.query.pageNo;
    const movieCount = await Movie.countDocuments();
    if (req.query.sortBy == "Name") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { title: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Year") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { year: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Rank") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { rank: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "IMDb") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { imdbRating: -1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Price") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { dailyRentalRate: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Availability") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { numberInStock: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Popularity") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { rentedCustomers: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    } else if (req.query.sortBy == "Genre") {
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
            director: 1,
            imdbRating: 1,
            mpAARating: 1,
            runTime: 1,
          },
        },
        {
          $sort: { genre: 1 },
        },
        {
          $skip: perPage * (page - 1),
        },
        {
          $limit: perPage,
        },
      ]);
    }
    return res.status(200).render("./movies", {
      movies: movies,
      movieCount: movieCount,
      perPage: perPage,
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
  customer = await Customer.findOne({ _id: customerId }, "rentedMovies");
  var movie = await Movie.aggregate([
    {
      $match: { _id: ObjectId(req.params.mid) },
    },
    {
      $lookup: {
        from: "genres",
        localField: "genreId",
        foreignField: "_id",
        as: "genreId",
      },
    },
    {
      $unwind: "$genreId",
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
      },
    },
  ]);
  console.log(movie);
  var otherMovies = await Movie.find(
    {
      _id: { $nin: [req.params.mid] },
      genreId: movie[0].genreId._id,
    },
    "_id title rank cast year img links dailyRentalRate director"
  );
  return res
    .status(200)
    .render("./moviePage.ejs", { movie: movie[0], otherMovies });
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
    const genre = await Genre.findOne({ name: req.body.genreName });
    if (!genre) return res.status(400).json("Invalid Genre");
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

        let movie = new Movie({
          title: apidata.d[0].l,
          genreId: genre._id,
          year: apidata.d[0].y,
          img: apidata.d[0].i.imageUrl,
          links: "https://www.imdb.com/title/" + apidata.d[0].id + "/",
          cast: apidata.d[0].s,
          rank: apidata.d[0].rank,
          genre: genre.name,
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
          movie.mpAARating = mpAA;
          movie.worldwide = worldwide;
          movie.save();
          res.status(200).redirect(`/api/movies/createmoviespage`);
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
    console.log(genresCustomer);
    const uniquegenres = [...new Set(genresCustomer)];
    console.log(uniquegenres);
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
    console.log(movies, "movies");
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
  var genresearch = await Movie.find({
    genre: { $regex: req.query.title, $options: "$i" },
  });
  let genre = await Genre.find({
    name: { $regex: req.query.title, $options: "$i" },
  });
  return res.status(200).render("./searchResultsPage.ejs", {
    movie: movie,
    genre: genre,
    title: req.query.title,
    genresearch: genresearch,
  });
};
