require("dotenv").config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Movie } = require("../models/movie");
const { Requested } = require("../models/requestedModel");
const { Genre } = require("../models/genre");
const { Customer } = require("../models/customer");

exports.screenSize = async (req, res) => {
  let screen = req.params.screenSize;
  screen = Math.floor(screen / 250);
  req.user.screenSize = screen;
  return res.json(screen);
};
exports.getMovies = async (req, res) => {
  try {
    return res.status(200).render("movies.ejs");
  } catch (err) {
    console.log(err);
  }
};

exports.getMoviesJSON = async (req, res) => {
  try {
    const perPage = 12;
    const page = req.query.pageNo || 1;
    const movieCount = await Movie.countDocuments();
    const movies = await Movie.aggregate([
      {
        $match: { numberInStock: { $gte: 1 } },
      },
      {
        $project: {
          title: 1,
          year: 1,
          img: 1,
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: 12 * (page - 1),
      },
      {
        $limit: 12,
      },
    ]);
    return res.status(200).json({
      movies: movies,
      url: process.env.WEBURL,
      movieCount: movieCount,
      perPage: perPage,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.movieCount = async (req, res) => {
  const perPage = 12;
  const movieCount = await Movie.countDocuments();
  return res.status(200).json({
    perPage,
    movieCount,
  });
};

exports.getAllMovies = async (req, res) => {
  try {
    var name = "";
    const movies = await Movie.aggregate([
      {
        $match: { numberInStock: { $gte: 1 } },
      },
      {
        $project: {
          title: 1,
          year: 1,
          img: 1,
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    return res.status(200).render("allmovies.ejs", {
      movies: movies,
      url: process.env.WEBURL,

      name: name,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllMoviesTester = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        $limit: 7,
      },
      {
        $match: { title: { $regex: req.query.title, $options: "$i" } },
      },
      {
        $project: {
          title: 1,
          year: 1,
          img: 1,
        },
      },
    ]);
    return res.status(200).json({
      movies: movies,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMoviesSort = async (req, res) => {
  try {
    if (req.query.sortBy == "Name") {
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
      ]);
    } else if (req.query.sortBy == "Year") {
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
      ]);
    } else if (req.query.sortBy == "Rank") {
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
      ]);
    } else if (req.query.sortBy == "IMDb") {
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
      ]);
    } else if (req.query.sortBy == "Price") {
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
      ]);
    } else if (req.query.sortBy == "Availability") {
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
          $sort: { numberInStock: -1 },
        },
      ]);
    } else if (req.query.sortBy == "Popularity") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            clicks: 1,
            year: 1,
          },
        },
        {
          $sort: { clicks: -1 },
        },
      ]);
    } else if (req.query.sortBy == "BoxOffice") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            worldwide: 1,
            clicks: 1,
            year: 1,
          },
        },
        {
          $sort: { worldwide: 1 },
        },
      ]);
    } else if (req.query.sortBy == "Genre") {
      var movies = await Movie.aggregate([
        {
          $project: {
            title: 1,
            img: 1,
            year: 1,
            genre: 1,
          },
        },
        {
          $sort: { genre: 1 },
        },
      ]);
    } else if (req.query.sortBy == "Runtime") {
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
      ]);
    }
    return res.status(200).render("./allmovies.ejs", {
      movies: movies,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    await Customer.updateOne(
      { _id: req.user._id },
      { $addToSet: { cart: movieId } }
    );
    req.flash("message", `Movie Added to Cart`);
    return res.status(200).redirect(`/api/movies/${movieId}`);
  } catch (err) {
    console.log(err);
  }
};

exports.getSpecificMovie = async (req, res) => {
  if (req.user) {
    if (req.user.subject == "User") {
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
            title: 1,
            img: 1,
            genreId: 1,
            rank: 1,
            cast: 1,
            year: 1,
            links: 1,
            numberInStock: 1,
            dailyRentalRate: 1,
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
            clicks: 1,
          },
        },
      ]);
    } else if (req.user.subject == "Customer") {
      var customer = await Customer.findOne(
        { _id: req.user._id },
        "rentedMovies cart wishList"
      );
      var rentedMovies = customer.rentedMovies;
      var carted = customer.cart;
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
            iReviewed: { $in: ["$_id", rentedMovies] },
            isCarted: { $in: ["$_id", carted] },
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
            clicks: 1,
          },
        },
      ]);
    } else {
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
            clicks: 1,
          },
        },
      ]);
    }
  }
  var rgenres = [];

  var tester = await Movie.findOne(
    { _id: req.params.mid },
    "genreId clicks"
  ).populate("genreId");

  tester.genreId.forEach((list) => {
    rgenres.push(list.name);
  });

  // var otherMovies = await Movie.find(
  //   {
  //     _id: { $nin: [req.params.mid] },
  //   },
  //   " title year img genreId"
  // ).populate("genreId", "_id");
  // shuffleArray(otherMovies);
  // otherMovies.forEach((list) => {
  //   for (var i = 0; i < tester.genreId.length; i++) {
  //     list.genreId.forEach((lost) => {
  //       if (othermovies.length > 11) return;
  //       if (
  //         lost._id.toString() == tester.genreId[i]._id.toString() &&
  //         !othermovies.includes(list)
  //       ) {
  //         othermovies.push(list);
  //       }
  //     });
  //   }
  // });

  tester.clicks += 1;
  tester.save();
  // var p = [...new Set(othermovies)];
  // p.length = Math.min(p.length, 12);
  return res.status(200).render("./moviePage.ejs", {
    movie: movie[0],
    // otherMovies: othermovies,
    rgenres,
    message: req.flash("message"),
  });
};

exports.getSpecificMovieJSON = async (req, res) => {
  if (req.user) {
    if (req.user.subject == "User") {
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
            clicks: 1,
          },
        },
      ]);
    } else if (req.user.subject == "Customer") {
      var customer = await Customer.findOne(
        { _id: req.user._id },
        "rentedMovies cart wishList"
      );
      var rentedMovies = customer.rentedMovies;
      var carted = customer.cart;
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
            iReviewed: { $in: ["$_id", rentedMovies] },
            isCarted: { $in: ["$_id", carted] },
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
            clicks: 1,
          },
        },
      ]);
    } else {
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
            clicks: 1,
          },
        },
      ]);
    }
  }
  var othermovies = [],
    rgenres = [];

  var tester = await Movie.findOne(
    { _id: req.params.mid },
    "genreId clicks"
  ).populate("genreId");

  tester.genreId.forEach((list) => {
    rgenres.push(list.name);
  });

  var otherMovies = await Movie.find(
    {
      _id: { $nin: [req.params.mid] },
    },
    " title year img genreId"
  ).populate("genreId", "_id");
  shuffleArray(otherMovies);
  otherMovies.forEach((list) => {
    for (var i = 0; i < tester.genreId.length; i++) {
      list.genreId.forEach((lost) => {
        if (othermovies.length > 11) return;
        if (
          lost._id.toString() == tester.genreId[i]._id.toString() &&
          !othermovies.includes(list)
        ) {
          othermovies.push(list);
        }
      });
    }
  });

  tester.clicks += 1;
  tester.save();
  var p = [...new Set(othermovies)];
  p.length = Math.min(p.length, 12);
  return res.status(200).json({
    movie: movie[0],
    otherMovies: othermovies,
    rgenres,
    // message: req.flash("message"),
  });
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    await Customer.updateOne(
      { _id: req.user._id },
      { $addToSet: { wishList: req.params.movieId } }
    );
    req.flash("message", `Movie Added to WishList`);
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
      const genre = await Genre.findOne(
        {
          name: { $regex: myarray[i], $options: "$i" },
        },
        "_id name"
      );
      if (!genre) {
        req.flash("message", "Genre Not found");
        res.status(400).redirect("/api/movies/createmoviespage");
      }
      genrearr.push(genre);
    }
    const movieadd = req.body.title;
    const checkmovie = await Movie.findOne({
      title: { $regex: req.body.title, $options: "$i" },
    });
    if (checkmovie) {
      req.flash("message", "Movie Already Exists");
      return res.status(304).redirect("/api/movies/createmoviespage");
    }
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
        genrearr.forEach((list) => {
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
              var rat = title.substring(0, i);
              if (!movie.imdbRating) newrat = rat;
            }
          });
          $(".ipc-metadata-list__item", html).each(function () {
            const title = $(this).text();
            if (title) {
              if (title.startsWith("Director")) {
                const director = title.substring(8, title.length);
                direcTor = director;
              }

              if (title.startsWith("Directors")) {
                const director = title.substring(9, title.length);
                direcTor = director;
              }

              if (title.startsWith("Runtime")) {
                const runtime = title.substring(7, title.length);
                runTime = runtime;
              }
              if (title.startsWith("Certificate")) {
                const certificate = title.substring(11, title.length);
                mpAA = certificate;
              }
              if (title.startsWith("Gross worldwide")) {
                const i = title.indexOf("$");
                const gross = title.substring(i, title.length);
                worldwide = gross;
              }
              if (title.startsWith("Aspect ratio")) {
                const rattio = title.substring(12, title.length);
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
          req.flash("message", "Movie Added Successfully");
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
  return res.status(200).render("./requestMovie");
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
  }
};

exports.createMoviesPage = async (req, res) => {
  const allGenres = await Genre.aggregate([
    {
      $project: {
        name: 1,
      },
    },
  ]);
  return res.status(200).render(`./createmovies`, {
    allGenres: allGenres,
    message: req.flash("message"),
  });
};

exports.displayMovie = async (req, res) => {
  // console.log(req.user.subject);
  const movie = await Movie.aggregate([
    {
      $match: { title: { $regex: req.query.title, $options: "$i" } },
    },
    {
      $project: {
        title: 1,
        year: 1,
        img: 1,
      },
    },
  ]);
  const genresearch = await Genre.findOne(
    {
      name: { $regex: req.query.title, $options: "$i" },
    },
    "_id"
  );
  var genreSearch = [];

  var moviesearch = await Movie.find(
    {},
    "cast _id, img year title director imdbRating genreId dailyRentalRate "
  ).populate("genreId");
  moviesearch.forEach((list) => {
    list.genreId.forEach((lost) => {
      if (genresearch) {
        if (lost._id.toString() === genresearch._id.toString()) {
          genreSearch.push(list);
        }
      }
    });
  });
  let genre = await Genre.aggregate([
    {
      $match: { name: { $regex: req.query.title, $options: "$i" } },
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        img: 1,
      },
    },
  ]);
  return res.status(200).render("./searchResultsPage.ejs", {
    movie: movie,
    genre: genre,
    title: req.query.title,
    genresearch: genreSearch,
  });
};
