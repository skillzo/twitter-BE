const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profile: {
      bio: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      dob: {
        type: String,
        default: "",
      },
      first_name: {
        type: String,
        default: "",
      },
      last_name: {
        type: String,
        default: "",
      },
      verified: {
        type: Boolean,
        default: false,
      },
      joined_date: {
        type: Date,
        default: Date.now,
      },
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    // tweets: {
    //   type: Array,
    //   default: [
    //     {
    //       tweet: String,
    //       likes: {
    //         type: Array,
    //         default: [],
    //       },
    //       retweets: {
    //         type: Array,
    //         default: [],
    //       },
    //       comments: [
    //         {
    //           username: String,
    //           comment: String,
    //         },
    //       ],
    //     },
    //     { timestamps: true },
    //   ],
    // },
  },
  { timestamps: true, virtuals: true }
);

module.exports = mongoose.model("User", UserSchema);
