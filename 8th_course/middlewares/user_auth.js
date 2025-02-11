const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

function user_Middleware(req, res, next) {
  const token = req.headers.authorization;

  const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(401).json({
      message: "Incorrect Credentials",
    });
  }
}

module.exports = {
  user_Middleware,
};
