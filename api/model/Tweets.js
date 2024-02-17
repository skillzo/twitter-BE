const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    no_of_likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Array,
      default: [],
    },
    retweets: {
      type: Array,
      default: [],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", TweetSchema);
