const mongoose = require("mongoose");

const RetweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Retweet", RetweetSchema);
