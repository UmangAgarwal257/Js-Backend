const express = require("express");

const app = express();
const port = 3000;

app.get("/multiply", (req, res) => {
  const { a, b } = req.query;
  const result = Number(a) * Number(b);
  res.json({ result });
});

app.get("/divide", (req, res) => {
  const { a, b } = req.query;
  if (Number(b) === 0) {
    res.status(400).json({ error: "Division by zero" });
  } else {
    const result = Number(a) / Number(b);
    res.json({ result });
  }
});

app.get("/sum", (req, res) => {
  const { a, b } = req.query;
  const result = Number(a) + Number(b);
  res.json({ result });
});

app.get("/subtract", (req, res) => {
  const { a, b } = req.query;
  const result = Number(a) - Number(b);
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
