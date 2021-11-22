const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 4,

      required: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 4,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    phoneToken: {
      type: String,
      default: "N/A",
    },
    imgs: [{ type: String }],
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model("User", userSchema);

exports.User = User;
