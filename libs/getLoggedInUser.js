const jwt = require("jsonwebtoken");

const getLoggedInUser = (req) => {
  const user_token = req.headers.Authorization || req.headers.authorization;

  const token = user_token.split(" ")[1];
  const decoded_user = jwt.decode(token);

  const { iat, exp, ...user } = decoded_user;
  return user;
};

module.exports = getLoggedInUser;
