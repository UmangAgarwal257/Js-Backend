const express = require("express");

const app = express();
const port = 3000;

let requestCount = 0;

const requestLogger = (req, res, next) => {
  requestCount++;
  next();
};

app.use(requestLogger);

app.get("/requestCount", (req, res) => {
  res.json({
    requestCount,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
