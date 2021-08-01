require('dotenv').config()
const {Movie, validate} = require('../models/movie');
const { Genre } = require('../models/genre');

exports.getMovies = async(req, res) =>{
   const movies = await Movie.aggregate([
       {
           $project:{
               _id:1,
               isMovieCreated:1,
               title:1,
               genreId:1,
               year:1,
               img:1,
               links:1,
               cast:1,
               rank:1,
               numberInStock:1,
               dailyRentalRate:1
           }
       }
   ]).sort({'name':1});
   res.render('./movies', {movies: movies});
}

exports.createMovies = async(req, res)=>{
   const genre = await Genre.findOne({name:req.body.genreName})
//    console.log('genre', genre);
   if (!genre) return res.status(400).json('Invalid Genre');

   const movieadd = req.body.title;
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

exports.othermovies = async(req, res)=>{
   

    return res.status(200).render('./moviePage.ejs', otherMovies);
}

exports.createMoviesPage = async(req, res)=>{
    let movie = await Movie.find({}).populate('genreId');
    return res.status(200).render(`./createmovies`, {movie:movie});
}

exports.displayMovieSearch = async(req, res)=>{
    let movie = await Movie.findOne({title:req.body.title}).populate('genreId');
    // console.log(movie)
    if(!movie) return res.status(404).send('Movie not found');
    let genre = await Genre.findOne({name:movie.genreId.name});
    let otherMovies = await Movie.find({genreId:genre._id});
    return res.status(200).render('./moviePage.ejs', {
        movie:movie,
        otherMovies:otherMovies
    });
}

exports.displayMovie = async(req, res)=>{
    let movie =  await Movie.findOne({title:req.params.title}).populate('genreId');
    // console.log(movie)
    if(!movie) return res.status(404).send('Movie not found');
    let genre = await Genre.findOne({name:movie.genreId.name});
    let otherMovies = await Movie.find({genreId:genre._id});
    console.log(otherMovies);

    for(var i=0; i<otherMovies.length; i++){
        if(otherMovies[i].title == movie.title){
            otherMovies.splice(i, 1);
        }
    }
    return res.status(200).render('./moviePage.ejs', {
        movie:movie,
        otherMovies:otherMovies
    });
}



exports.updateMovies = async(req, res) =>{
   // const { error } = validate(req.body);
   //  if(error) return res.status(400).send(error.details[0].message);
   
    const movie =await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title}, {
       new :true
   })
    if(!movie) return res.status(404).send('Movie not found');

    res.send(movie);
}

exports.deleteMovies = async (req, res) => {
   const movie =await Movie.findByIdAndRemove(req.params.id);
 
     if(!movie) return res.status(404).send('Movie not found');
 
     res.send(movie);
 }


 
 
