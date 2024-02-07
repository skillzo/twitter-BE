const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const User = require("../model/Users");

dotenv.config();

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //   invalid input in the frontend
  if (!username || !password) {
    return res.status(400).json({ message: "name and password are required." });
  }

  let found_user;

  try {
    found_user = await User.findOne({ username });
    if (!found_user) {
      return res.status(404).send({ message: "user does not exist" });
    }

    const password_match = await bcrypt.compare(password, found_user.password);
    if (password_match) {
      const access_token = jwt.sign(
        {
          id: found_user._id,
          username: found_user.username,
          name: found_user?.profile?.name,
          profile_picture: found_user?.profile?.profile_picture,
        },
        process.env.jwt_key,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "login succesful",
        data: {
          token: access_token,
          id: found_user.id,
          username: found_user.username,
          profile: found_user.profile,
          email: found_user.email,
          followers: found_user.followers,
          followings: found_user.followings,
        },
      });
    }
  } catch (err) {
    console.log("login error here", err);
    res.sendStatus(500);
  }
});

//create user
router.post("/signup", async (req, res) => {
  const payload = req.body;
  const username_exist = await User.findOne({ username: payload.username });
  const useremail_exist = await User.findOne({ email: payload.email });

  if (username_exist || useremail_exist)
    return res.status(403).json({ message: "User already exist" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(payload.password, salt);

    const new_user = new User({
      username: payload.username,
      email: payload.email,
      password: hashed_password,
    });

    const user = await new_user.save();

    const access_token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        name: user?.profile?.name,
        profile_picture: user?.profile?.profile_picture,
      },
      process.env.jwt_key,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "succesful",
      data: {
        id: user.id,
        token: access_token,
        username: user.username,
        profile: user.profile,
        email: user.email,
        followers: user.followers,
        followings: user.followings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
