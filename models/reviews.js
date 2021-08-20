const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    genreId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Genre',
        required:true
    },
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required:true
    },
    rating:{type:Number},
    reviews:{type:String, default:""},
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
},
{
    timestamps:true
});

const Review = mongoose.model('Review', reviewSchema);

exports.Review = Review;