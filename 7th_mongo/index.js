const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
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

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email: email,
    password: password,
  });

  if (response) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } else {
    res.status(401).json({
      message: "Incorrect credentials",
    });
  }
});

app.post("/todo", auth, (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;
  TodoModel.create({
    title,
    userId,
    done,
  });

  res.json({
    message: "Todo created",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;

  const todos = await TodoModel.find({
    userId: userId,
  });
  res.json({
    todos,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
