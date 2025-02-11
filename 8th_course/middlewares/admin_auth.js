const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;

  const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);

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
  adminMiddleware,
};
