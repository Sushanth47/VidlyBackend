const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    rating: { type: Number },
    reviews: { type: String, default: "" },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    iVoted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

exports.Review = Review;
