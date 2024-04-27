const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = require("express").Router();
const { v4 } = require("uuid");

const User = require("../model/Users");
const { transporter } = require("../libs/nodemailer-init");

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
      return res.status(404).send({ message: "Invaild username or password" });
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
    } else {
      return res
        .status(400)
        .json({ message: "Incorrect username or passowrd" });
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

//create user
router.post("/sign-up", async (req, res) => {
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
      profile: { name: `user${v4()}` },
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

router.get("/forgot-password", async (req, res) => {
  const { email } = req.query;
  const found_user = await User.findOne({ email });

  try {
    if (!found_user) {
      return res.status(404).json({ message: "user not found" });
    }
    const uuid_key = v4();
    const hashed_salt = await bcrypt.hash(uuid_key, 10);

    // update the user salt in db
    await User.findByIdAndUpdate(
      { _id: found_user._id },
      { $set: { salt: hashed_salt } }
    );

    const reset_password_token = jwt.sign(
      {
        id: found_user._id,
        salt: uuid_key,
      },
      process.env.jwt_key,
      {
        expiresIn: "5m",
      }
    );

    const reset_passowrd_link = `${process.env.base_url}/reset-password?token=${reset_password_token}&email=${email}`;

    const mailOptions = {
      from: "rickie.frami@ethereal.email",
      to: email,
      subject: "Twitter Reset Password Link",
      text: reset_passowrd_link,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email: ", error);
      }
    });

    res.status(200).json({
      message: "reset link has been sent to your email",
      link: reset_passowrd_link,
    });
  } catch (err) {
    console.log("err", err);
    res.sendStatus(500);
  }
});

//reset password
router.post("/reset-password", async (req, res) => {
  const { email, password, token } = req.body;
  const found_user = await User.findOne({ email });
  try {
    const { salt } = jwt.decode(token);
    const saltDetails_match = await bcrypt.compare(salt, found_user.salt);
    const hashed_password = await bcrypt.hash(password, 10);

    if (!found_user) {
      return res.status(404).json("user not found");
    } else {
      if (!saltDetails_match) {
        return res.send(401).json({ message: "unauthorized" });
      }

      await User.findByIdAndUpdate(
        { _id: found_user._id },
        { $set: { password: hashed_password } },
        { returnOriginal: false }
      );
    }

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log("reset password err", err);
    res.sendStatus(500);
  }
});

// router.get("/script", async (req, res) => {
//   try {
//     await User.updateMany({}, { $set: { salt: "" } });

//     console.log("All documents updated successfully");
//   } catch (error) {
//     console.error("Error updating documents:", error);
//   }
// });

module.exports = router;
