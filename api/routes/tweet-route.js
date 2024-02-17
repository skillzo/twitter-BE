const Mongoose = require("mongoose");
const getLoggedInUser = require("../libs/getLoggedInUser");
const Tweet = require("../model/Tweets");
const User = require("../model/Users");
const Retweet = require("../model/Retweets");

const router = require("express").Router();

//get all tweets
router.get("/getAll", async (req, res) => {
  try {
    const all_tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        select: [
          "id",
          "content",
          "no_of_retweets",
          "no_of_likes",
          "updatedAt",
          "tweet",
          "image",
        ],
        populate: {
          path: "user",
          model: "User",
          select: [
            "username",
            "profile.name",
            "profile.verified",
            "profile.profile_picture",
          ],
        },
      })
      .populate({
        path: "user",
        select: [
          "username",
          "profile.name",
          "profile.verified",
          "profile.profile_picture",
        ],
      });

    //console.log("all tweet ", all_tweets);
    return res.status(200).json({ message: "sucessfull", data: all_tweets });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//get tweets by id
router.get("/getById/:id", async (req, res) => {
  try {
    const tweet_by_id = await Tweet.findOne({ _id: req.params.id })
      .populate({
        path: "comments",
        select: [
          "id",
          "content",
          "no_of_retweets",
          "no_of_likes",
          "updatedAt",
          "tweet",
        ],
        populate: {
          path: "user",
          model: "User",
          select: [
            "username",
            "profile.name",
            "profile.verified",
            "profile.profile_picture",
          ],
        },
      })
      .populate({
        path: "user",
        select: [
          "username",
          "profile.name",
          "profile.verified",
          "profile.profile_picture",
        ],
      });

    return res.status(200).json({ message: "sucessfull", data: tweet_by_id });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//get user tweet
router.get("/getByUser/:id", async (req, res) => {
  try {
    const all_user_tweets = await Tweet.find({
      user: req.params.id,
    }).populate({
      path: "user",
      select: [
        "_id",
        "username",
        "profile.name",
        "profile.verified",
        "profile.profile_picture",
      ],
    });
    res.status(200).json(all_user_tweets);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create tweet
router.post("/create", async (req, res) => {
  const user = getLoggedInUser(req);

  try {
    const new_tweet = new Tweet({
      content: req.body.content,
      image: req.body.image || [],
      user: user.id,
    });

    const added_tweet = await new_tweet.save();

    res.status(200).json({ message: "sucessfull", data: added_tweet });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// like tweet
router.post("/like/:id", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);

  try {
    const tweet = await Tweet.findOne({ _id: req.params.id });

    const already_liked = tweet.likes.some((like) =>
      like.id.includes(loggedIn_user.id)
    );

    if (already_liked) {
      await Tweet.findByIdAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: loggedIn_user } }
      );
      res.status(200).json("Tweet has been unliked");
    } else {
      await Tweet.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { likes: loggedIn_user } }
      );
      res.status(200).json("Tweet has been liked");
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// retweet
router.get("/retweet/:id", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);

  try {
    const tweet = await Tweet.findOne({ _id: req.params.id });
    const already_retweeted = tweet.retweets.some((retweet) =>
      retweet.includes(loggedIn_user.id)
    );

    if (already_retweeted) {
      await Tweet.findByIdAndUpdate(
        { _id: req.params.id },
        { $pull: { retweets: loggedIn_user.id } }
      );
      await Retweet.findOneAndDelete({
        user: loggedIn_user.id,
        tweet: tweet._id,
      });
      res.status(200).json("retweet removed ");
    } else {
      await Tweet.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { retweets: loggedIn_user.id } }
      );
      await Retweet.create({
        user: loggedIn_user.id,
        tweet: tweet._id,
      });
      res.status(200).json("Tweet has been retweeted");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get timeline feeds
router.get("/timelineFeed", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);
  try {
    const user = await User.findOne({ _id: loggedIn_user.id });

    const timeline_post = await Promise.all(
      user.followings.map((f) => Tweet.find({ user: f }))
    );

    res.status(200).json(timeline_post);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
