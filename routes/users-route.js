const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../model/Users");

//get all users
router.get("/getAll", async (req, res) => {
  let users = [];
  const allUsers = await User.find();
  allUsers.map((user) => {
    users.push({
      username: user.username,
      email: user.email,
      profile: user.profile,
      profilePicture: user.profilePicture,
      coverPicture: user.profilePicture,
    });
  });

  try {
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
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

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
router.put("/update/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $set: req.body });

    res.status(200).json({ message: "Account has been updated" });
  } catch (err) {
    res.status(500).json(err);
    console.log("update error here", err);
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

module.exports = router;
