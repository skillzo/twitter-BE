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
      name: {
        type: String,
        default: "",
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
      joined_date: {
        type: Date,
        default: Date.now,
      },
      profile_picture: {
        type: String,
        default: "",
      },
      cover_picture: {
        type: String,
        default: "",
      },
    },

    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    virtuals: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("User", UserSchema);
