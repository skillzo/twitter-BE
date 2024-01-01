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
    },
    no_of_comments: {
      type: Number,
      default: 0,
      min: 0,
    },
    no_of_retweets: {
      type: Number,
      default: 0,
      min: 0,
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

// {
//   id: "t0",
//   user: {
//     id: "u1",
//     username: "VadimNotJustDev",
//     name: "Vadim",
//     image:
//       "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png",
//   },
//   createdAt: "2023-12-25T8:59:33Z",
//   content: "Can you please check if the Subscribe button on Youtube works?",
//   image:
//     "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png",
//   no_of_comments: 123,
//   no_of_retweets: 11,
//   no_of_likes: 10,
// },

module.exports = mongoose.model("Tweet", TweetSchema);
