const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

function auth(req, res, next) {
  const token = req.headers.authorization;

  const response = jwt.verify(token, process.env.JWT_USER_PASSWORD);

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
};
