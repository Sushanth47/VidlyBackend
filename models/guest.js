const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    subject: "Guest",
    searches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

const Guest = mongoose.Model('Guest', guestSchema);

exports.Guest = Guest;