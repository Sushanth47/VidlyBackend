const mongoose = require("mongoose");

const screenSizeSchema = new mongoose.Schema(
  {
    size: Number,
    amount: Number,
  },

  {
    timestamps: true,
  }
);

const ScreenSize = mongoose.model("ScreenSize", screenSizeSchema);

exports.ScreenSize = ScreenSize;
