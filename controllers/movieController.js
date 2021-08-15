require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const {Requested} = require('../models/movie');
const { Genre } = require('../models/genre');

async function escapeRegex(text) {
    // console.log(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"))
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getMovies = async(req, res) =>{
  const movies = await Movie.find({}).populate('genreId', 'name _id ').sort({'createdAt':- 1});
  //console.log(movies, 'req.user');
  return res.status(200).render('./movies', {movies: movies, locals:res.locals});
}



exports.getSpecificMovie = async(req, res)=>{
    // console.log(req.params, 'params');
    var movie = await Movie.findOne({_id:req.params.mid}).populate('genreId');
    var otherMovies = await Movie.find({_id:{$nin:[req.params.mid]}});
    return res.status(200).render('./moviePage.ejs', {movie, otherMovies});
}

exports.createMovies = async(req, res)=>{
    // console.log(res.locals, 'req.user');
   const genre = await Genre.findOne({name:req.body.genreName})
//    console.log('genre', genre);
   if (!genre) return res.status(400).json('Invalid Genre');
   const movieadd = req.body.title;
   const checkmovie = await Movie.findOne({title:movieadd});
   if(checkmovie) return res.status(409).send('Movie already exists');
   var axios = require("axios").default;

   var options = {
   method: 'GET',
   url: 'https://imdb8.p.rapidapi.com/auto-complete',
   params: {q: movieadd},
   headers: {
       'x-rapidapi-key': process.env.API_KEY,
       'x-rapidapi-host': process.env.API_HOST
   }
   };

   axios.request(options).then(function (response) {
    //    console.log(response.data);
       var apidata = response.data
       // response.data.d.forEach(list=>{
           let movie = new Movie({
           title:apidata.d[0].l,
           genreId:genre._id,
           year:apidata.d[0].y,
           img:apidata.d[0].i.imageUrl,
           links:"https://www.imdb.com/title/"+apidata.d[0].id+"/",
           cast: apidata.d[0].s,
           rank:apidata.d[0].rank,
           numberInStock: req.body.numberInStock,
           dailyRentalRate: req.body.dailyRentalRate
       })
       movie.ismovieCreated = true;
    movie.save();
    // console.log(movie.rank);
    res.status(200).redirect(`/api/movies/createmoviespage`);
       // })
   }).catch(function (error) {
       console.error(error);
   });  
}

exports.requestedMoviePage = async(req, res)=>{
    const movie = await Requested.find({ismovieCreated:false});
    return res.status(200).render('./',{movie:movie});
}

exports.requestedMovie = async(req, res)=>{
    const movie = await Movie.findOne({title:req.body.title});
    if(movie) return res.status(400).send('movie already exists');

    const requested = new Requested({
        title:req.body.title
    });
    customer = await Requested.save();
    return res.status(200).redirect('/api/movies/movies');
}

exports.createMoviesPage = async(req, res)=>{
    // console.log(res.locals, 'locals')
    let movie = await Movie.find({}).populate('genreId');
    const allGenres = await Genre.find({}, 'name');
    return res.status(200).render(`./createmovies`, {movie:movie, allGenres:allGenres});
}

// exports.displayMovieSearch = async(req, res)=>{
//     const regex = new RegExp(escapeRegex(req.body.title), 'gi');
//     let movie = await Movie.findOne({title:req.body.title}).populate('genreId');
//     // console.log(movie)
//     if(!movie) return res.status(404).send('Movie not found');
//     
//     
// }

exports.displayMovie = async(req, res)=>{
   var movie = await Movie.find({title:{$regex:req.query.title, $options:'$i'}}).populate('genreId');
   let genre = await Genre.find({name:{$regex:req.query.title, $options:'$i'}});
    return res.status(200).render('./searchResultsPage.ejs', {
        movie:movie,
        genre:genre,
        title:req.query.title
    });
}






 
 
