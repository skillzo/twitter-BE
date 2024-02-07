const express = require("express");
const app = express();
const dotenv = require("dotenv");

const userRoute = require("./routes/users-route");
const authRoute = require("./routes/auth-route");
const tweetRoute = require("./routes/tweet-route");
const commentRoute = require("./routes/comment-route");
const conversationRoute = require("./routes/conversation-route");
const messageRoute = require("./routes/message-route");

const { default: mongoose } = require("mongoose");
const verifyjwt = require("./libs/verifyJWt");
const jwt = require("jsonwebtoken");
dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

// middleware
app.use(express.json());

app.use("/auth", authRoute);

// app.use(verifyjwt);
app.use("/api/users", userRoute);
app.use("/api/tweet", tweetRoute);
app.use("/api/comment", commentRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
