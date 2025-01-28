const express = require("express");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  const timestamp = new Date().toUTCString();
  console.log(
    `Time : [${timestamp}] , Method : ${req.method}, URL : ${req.url}`
  );
  next();
});

app.get("/user", (req, res) => {
  res.json({ msg: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
