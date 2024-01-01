const router = require("express").Router();
const bcrypt = require("bcrypt");
const { mongoose } = require("mongoose");

const User = require("../model/Users");
const getLoggedInUser = require("../libs/getLoggedInUser");

//get all users
router.get("/getAll", async (_, res) => {
  try {
    const all_users = await User.find({}, { password: 0 });

    return res.status(200).json({ message: "Sucessful", data: all_users });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

//create user
router.post("/create", async (req, res) => {
  const payload = req.body;
  const username_exist = await User.findOne({ username: payload.username });
  const useremail_exist = await User.findOne({ email: payload.email });

  if (username_exist || useremail_exist) {
    return res.status(403).json({ message: "user already exist" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(payload.password, salt);

    const new_user = new User({
      username: payload.username,
      email: payload.email,
      password: hashed_password,
    });

    const user = await new_user.save();

    res.status(200).json({ message: "succesful", data: user });
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
    const user_token = getLoggedInUser(req); // this is a function that gets the id of the logged in user from the token
    const loggedIn_user = await User.findOne({ _id: user_token.id });
    const to_be_followed = await User.findOne({ _id: req.params.id });

    const already_follow = to_be_followed?.followers.some((user) =>
      new mongoose.Types.ObjectId(user.id).equals(loggedIn_user._id)
    );

    if (already_follow) {
      return res.status(409).json({ message: "You already follow this user" });
    }

    // update logged in user followings
    await User.findByIdAndUpdate(
      { _id: loggedIn_user._id },
      {
        $push: {
          followings: {
            id: to_be_followed._id,
            username: to_be_followed.username,
            name: to_be_followed.profile.name,
            profile_picture: to_be_followed.profile_picture,
          },
        },
      }
    );
    //  update to be followed user followers
    await User.findByIdAndUpdate(
      { _id: to_be_followed.id },
      {
        $push: {
          followers: {
            id: loggedIn_user._id,
            username: loggedIn_user.username,
            name: loggedIn_user.profile.name,
            profile_picture: loggedIn_user.profile.profile_picture,
          },
        },
      }
    );

    return res.status(200).json({
      message: "successfull",
      data: { loggedIn_user, to_be_followed },
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// unfollow user
router.post("/unfollow/:id", async (req, res) => {
  try {
    const user_token = getLoggedInUser(req); // this is a function that gets the id of the logged in user from the token
    const loggedIn_user = await User.findOne({ _id: user_token.id });
    const to_be_unfollowed = await User.findOne({ _id: req.params.id });

    const user_follows = to_be_unfollowed?.followers.some((user) =>
      new mongoose.Types.ObjectId(user.id).equals(loggedIn_user._id)
    );

    if (user_follows) {
      // update followings of the logged in user
      await User.findByIdAndUpdate(
        { _id: loggedIn_user._id },
        {
          $pull: {
            followings: {
              id: to_be_unfollowed._id,
            },
          },
        }
      );

      // update the followers of the other user
      await User.findByIdAndUpdate(
        { _id: to_be_unfollowed._id },
        {
          $pull: {
            followers: {
              id: loggedIn_user._id,
            },
          },
        }
      );

      return res
        .status(200)
        .json({ message: "successfully unfollowed this user" });
    } else {
      return res.status(404).json({ message: "You don't follow this user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = router;
