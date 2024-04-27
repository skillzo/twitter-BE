const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const verifyjwt = async (req, res, next) => {
  const user_token = req.headers.Authorization || req.headers.authorization;

  if (!user_token?.startsWith("Bearer")) {
    return res.status(401).json({ message: "missing token" });
  }
  const token = user_token.split(" ")[1];

  jwt.verify(token, process.env.jwt_key, (err) => {
    if (err && err.message === "invalid signature") {
      console.log("token error here", err);
      return res.status(401).json({ message: "Invalid token " });
    }
    next();
  });
};

module.exports = verifyjwt;
