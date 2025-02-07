const express = require("express");
const { UserModel, TodoModel } = require("./db");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  UserModel.insert({
    name: name,
    password: password,
    email: email,
  });
});

app.post("/login", (req, res) => {});

app.post("/todo", (req, res) => {});

app.get("/todos", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
