const express = require("express");
const app = express();
const dotenv = require("dotenv");

const userRoute = require("./routes/users-route");
const { default: mongoose } = require("mongoose");
dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

// middleware
app.use(express.json());

app.use("/api/users", userRoute);

app.listen(8000, () => {
  console.log("server running on port 3000");
});
