const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const JWT_SECRET = "Umang1234";
const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://umangagarwal257:tannu2006@cluster0.2lbtw.mongodb.net/todo-umang"
);
app.use(express.json());

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  await UserModel.create({
    name: name,
    password: password,
    email: email,
  });
  res.json({
    message: "You are signed up",
  });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
    password: password,
  });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorized",
        });
      } else {
        req.userId = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
}

app.use(auth);

app.post("/todo", (req, res) => {});

app.get("/todos", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
