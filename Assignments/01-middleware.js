const express = require("express");

const app = express();
const port = 3000;

const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toUTCString();
  console.log(`Time : [${timestamp}] `);
  console.log(`Method : ${req.method}`);
  console.log(`URL : ${req.url}`);
  next();
};

app.use(loggerMiddleware);

app.get("/user", (req, res) => {
  res.json({ msg: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
