const getLoggedInUser = require("../libs/getLoggedInUser");
const Comment = require("../model/Comments");
const Tweet = require("../model/Tweets");

const router = require("express").Router();

router.post("/create/:id", async (req, res) => {
  const user = getLoggedInUser(req);

  try {
    const new_comment = new Comment({
      content: req.body.content,
      user: user.id,
      tweet: req.params.id,
      image: req.params.image,
    });

    await new_comment.save();

    await Tweet.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { no_of_comments: 1 }, $push: { comments: new_comment._id } }
    );

    return res.status(200).json({ messaage: "Sucessfull" });
  } catch (err) {
    console.log("create tweet error here", err);
    return res.status(500).json({ messaage: err });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const all_comments = await Comment.find().populate({
      path: "user",
      select: ["username", "profile.profile_picture", "profile.name"],
    });
    res.status(200).json({ message: "successful", data: all_comments });
  } catch (err) {
    return res.status(500).json({ messaage: err });
  }
});

module.exports = router;
