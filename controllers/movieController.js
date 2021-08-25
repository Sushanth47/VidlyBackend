require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const {Requested} = require('../models/requestedModel');
const { Genre } = require('../models/genre');



exports.getMovies = async(req, res) =>{
    var userispresent;
  const movies = await Movie.find({}).populate('genreId', 'name _id ').sort({'createdAt':- 1});
  //console.log(movies, 'req.user');
    if(req.user){
        userispresent = true
    }else{
        userispresent = false
    }
  return res.status(200).render('./movies', {movies: movies, userispresent:userispresent});
}

exports.getSpecificMovie = async(req, res)=>{
    // console.log(req.params, 'params');
    var movie = await Movie.findOne({_id:req.params.mid}).populate('genreId');
    var otherMovies = await Movie.find({_id:{$nin:[req.params.mid]}, genreId:movie.genreId._id});
    return res.status(200).render('./moviePage.ejs', {movie, otherMovies});
}

exports.createMovies = async(req, res)=>{
    // console.log(res.locals, 'req.user');
   const genre = await Genre.findOne({name:req.body.genreName})
//    console.log('genre', genre);
   if (!genre) return res.status(400).json('Invalid Genre');
   const movieadd = req.body.title;
   const checkmovie = await Movie.findOne({title:{$regex:req.body.title, $options:'$i'}});
   if(checkmovie) return res.status(409).send('Movie already exists');
   var axios = require("axios").default;
   await Requested.findOneAndUpdate({title:{$regex:req.body.title, $options:'$i'}}, {ismovieCreated:true});
   
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
    return res.status(200).render('./requestMovie');
}

exports.requestedMovie = async(req, res)=>{
    try{
        var requestedCheck = await Requested.find({title:{$regex:req.body.title, $options:'$i'}});
        const movie = await Movie.findOne({title:{$regex:req.body.title, $options:'$i'}});
        if(movie){
            if(movie.numberInStock == 0){
            return res.status(200).send('The Movie is currently out of Stock. We have getting it asap as possible!') 
            }else{
            return res.status(409).send('movie already exists');
            }
        } 
        if(requestedCheck.length>0){
            requestedCheck.forEach(list=>{
                list.requestCount+=1;
                list.save();
            })
            return res.status(409).json('Movie Already Requested. We are working on Bringing it to your nearest stores asap as possible!');
        }else{
        let requested = new Requested({
            title:req.body.title,
            requestCount:1
        });
        requested.save();
        return res.status(200).redirect('/api/movies/requestMovie');
        }
    }
    catch(err){
        console.log(err);
        return res.status(200).json(err);
    }    
    
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

// what




 
 
