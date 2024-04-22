const express = require("express");
const app = express();
const dotenv = require("dotenv");
const uuid = require("uuid");
const cors = require("cors");

const userRoute = require("./routes/users-route");
const authRoute = require("./routes/auth-route");
const tweetRoute = require("./routes/tweet-route");
const commentRoute = require("./routes/comment-route");
const conversationRoute = require("./routes/conversation-route");
const messageRoute = require("./routes/message-route");
const verifyjwt = require("./libs/verifyjwt");
const { storage, fileFilter } = require("./config/upload-config");

const { default: mongoose } = require("mongoose");
dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

// middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);

//protected routes
app.use(verifyjwt);

app.use("/api/users", userRoute);
app.use("/api/tweet", tweetRoute);
app.use("/api/comment", commentRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

const port = process.env.PORT || 8080;
mongoose.connection.on("open", () => {
  console.log("Connected to MongoDB successfully");
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
