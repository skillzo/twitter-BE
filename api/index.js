const express = require("express");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const uuid = require("uuid");
const cors = require("cors");

const userRoute = require("./routes/users-route");
const authRoute = require("./routes/auth-route");
const tweetRoute = require("./routes/tweet-route");
const commentRoute = require("./routes/comment-route");
const conversationRoute = require("./routes/conversation-route");
const messageRoute = require("./routes/message-route");
const { storage, fileFilter } = require("./config/upload-config");

const { default: mongoose } = require("mongoose");
const verifyjwt = require("./libs/verifyjwt");
const jwt = require("jsonwebtoken");
dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

// Event listener for successful connection

// middleware
app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);

const upload = multer({
  storage,
  // fileFilter,
  // limits: {
  //   fileSize: 2 * 1024 * 1024,
  // },
});

// app.use(verifyjwt);
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  // console.log(file);
  // res.status(200).json(file);
});

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
