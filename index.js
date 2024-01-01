const express = require("express");
const app = express();
const dotenv = require("dotenv");

const userRoute = require("./routes/users-route");
const authRoute = require("./routes/auth-route");
const tweetRoute = require("./routes/tweet-route");
const commentRoute = require("./routes/comment-route");

const { default: mongoose } = require("mongoose");
const verifyjwt = require("./libs/verifyJWt");
dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

// middleware
app.use(express.json());

app.use("/auth", authRoute);

// app.use(verifyjwt);
app.use("/api/users", userRoute);
app.use("/api/tweet", tweetRoute);
app.use("/api/comment", commentRoute);

app.listen(8000, () => {
  console.log("server running on port 3000");
});
