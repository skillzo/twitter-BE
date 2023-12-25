const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  user_id: {
    type: string,
    required: true,
  },
  tweet_id: {
    type: mongoose.ObjectId,
  },
  tweets: {
    type: Array,
    default: [
      {
        tweet: String,
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
            user_id: String,
            comment: String,
          },
        ],
      },
      { timestamps: true },
    ],
  },
});

module.exports = mongoose.model("Tweets");
