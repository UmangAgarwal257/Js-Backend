const express = require("express");
const { UserModel, TodoModel } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { z } = require("zod");
const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://umangagarwal257:tannu2006@cluster0.2lbtw.mongodb.net/todo-umang"
);
app.use(express.json());

app.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(30).email(),
    name: z.string().min(3).max(30),
    password: z
      .string()
      .min(3)
      .max(30)
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*$/),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      message: "Incorrect format",
    });
    return;
  }
  try {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
      name: name,
      password: hashedPassword,
      email: email,
    });

    res.json({
      message: "You are signed up",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during signup",
    });
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email: email,
  });

  if (!response) {
    res.status(401).json({
      message: "This user doesn't exist",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, response.password);

  if (passwordMatch) {
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
