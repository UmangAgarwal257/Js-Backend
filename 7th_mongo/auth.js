const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const token = req.headers.authorization;

  const response = jwt.verify(token, process.env.JWT_SECRET);

  if (response) {
    req.userId = response.id;
    next();
  } else {
    res.status(401).json({
      message: "Incorrect Credentials",
    });
  }
}

module.exports = {
  auth,
  jwtSecret: process.env.JWT_SECRET,
};
