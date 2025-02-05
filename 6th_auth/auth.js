const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const JWT_SECRET = "Umang123";

app.use(express.json());

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorized",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
}

const users = [];

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username,
    password,
  });

  res.json({
    message: "You are signed up",
  });
});

app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET
    );
    res.header("authorization", token);
    user.token = token;
    res.json({
      token,
    });
    console.log(users);
  } else {
    res.status(403).json({
      message: "Invalid username or password",
    });
  }
});

app.use(auth);

app.get("/me", (req, res) => {
  const token = req.headers.authorization;
  const userDetails = jwt.verify(token, JWT_SECRET);
  const username = userDetails.username;
  const user = users.find((user) => user.token === token);

  if (userDetails) {
    res.json({
      username: user.username,
      password: user.password,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
