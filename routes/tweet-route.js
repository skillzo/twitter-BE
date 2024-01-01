const getLoggedInUser = require("../libs/getLoggedInUser");
const Tweet = require("../model/Tweets");
const User = require("../model/Users");

const router = require("express").Router();

//get all tweets
let getAllCount = 0;
router.get("/getAll", async (req, res) => {
  getAllCount += 1;
  console.log("query times for get all tweet", getAllCount);
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
let count = 0;
router.get("/getById/:id", async (req, res) => {
  count += 1;
  console.log("query times for tweetById", count);
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

// create tweet
router.post("/create", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.user_id });
    const new_tweet = new Tweet({
      content: req.body.content,
      image: req.body.image,
      user: req.body.user,
    });

    const added_tweet = await new_tweet.save();

    res.status(200).json({ message: "sucessfull", data: added_tweet });
  } catch (err) {
    res.status(500).josn({ message: err });
  }
});

// like tweet
router.post("/like/:id", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);

  try {
    const tweet = await Tweet.findOne({ _id: req.params.id });

    await Tweet.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { likes: loggedIn_user }, $inc: { no_of_likes: 1 } }
    );

    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// unlike tweet
router.post("/unlike/:id", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);

  try {
    await Tweet.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: { id: loggedIn_user.id } }, $inc: { no_of_likes: -1 } }
    );

    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// retweet twwet
router.post("/unlike/:id", async (req, res) => {
  const loggedIn_user = getLoggedInUser(req);

  try {
    await Tweet.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: { id: loggedIn_user.id } }, $inc: { no_of_likes: -1 } }
    );

    return res.status(200).json({ message: "Successful" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = router;
