const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/Users");

const getLoggedInUser = require("../libs/getLoggedInUser");

//get all users
router.get("/getAll", async (req, res) => {
  let query = {};
  try {
    if (req.query.name) {
      query = {
        $or: [
          { username: { $regex: req.query.name, $options: "i" } },
          { "profile.name": { $regex: req.query.name, $options: "i" } },
        ],
      };
    }

    const all_users = await User.find(query, [
      "username",
      "profile.profile_picture",
      "profile.name",
      "profile.is_verified",
    ]);
    return res.status(200).json({ message: "Sucessfull", data: all_users });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

router.get("/getById/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id }, { password: 0 })
      .populate({
        path: "followings",
        model: "User",
        select: [
          "_id",
          "username",
          "profile.name",
          "profile.is_verified",
          "profile.profile_picture",
        ],
      })
      .populate({
        path: "followers",
        model: "User",
        select: [
          "_id",
          "username",
          "profile.name",
          "profile.is_verified",
          "profile.profile_picture",
        ],
      });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
router.put("/update/:id", async (req, res) => {
  try {
    const found_user = await User.findOne({ _id: req.params.id });

    if (!found_user) {
      return res
        .status(400)
        .json({ message: `user with id ${req.params.id}  does not exist` });
    }
    await User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
    return res.status(200).json({ message: "Account has been updated" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow user
router.post("/follow/:id", async (req, res) => {
  try {
    const loggedIn_user = getLoggedInUser(req);
    const to_be_followed = await User.findOne({ _id: req.params.id });

    const already_follow = to_be_followed.followers.some((f) =>
      f.includes(loggedIn_user.id)
    );

    if (already_follow) {
      await User.findByIdAndUpdate(
        { _id: loggedIn_user.id },
        {
          $pull: {
            followings: to_be_followed._id,
          },
        }
      );

      await User.findByIdAndUpdate(
        { _id: to_be_followed._id },
        {
          $pull: {
            followers: loggedIn_user.id,
          },
        }
      );
      res.status(200).json("User has been unfollowed");
    } else {
      await User.findByIdAndUpdate(
        { _id: loggedIn_user.id },
        {
          $push: {
            followings: to_be_followed._id,
          },
        }
      );

      await User.findByIdAndUpdate(
        { _id: to_be_followed._id },
        {
          $push: {
            followers: loggedIn_user.id,
          },
        }
      );
      res.status(200).json("User has been followed");
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = router;
