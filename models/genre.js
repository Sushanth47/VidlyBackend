const mongoose = require("mongoose");
// const Joi = require('Joi')

var genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    img: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

var Genre = mongoose.model("Genre", genreSchema);

exports.Genre = Genre;
