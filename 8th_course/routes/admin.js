const { Router } = require("express");
const { AdminModel } = require("../db");
require("dotenv").config({ path: __dirname + "/../.env" });
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminRouter = Router();

// adminRouter.use(adminMiddleware);

adminRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(30).email(),
    name: z.string().min(3).max(30),
    password: z.string().min(3).max(30),
  });
  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      message: "Incorrect format",
    });
    return;
  }
  try {
    const { name, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);

    await AdminModel.create({
      name,
      password: hashedPassword,
      email,
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

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({
    email: email,
  });

  if (!admin) {
    res.status(401).json({
      message: "This admin doesn't exist",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: admin._id.toString(),
      },
      process.env.JWT_ADMIN_PASSWORD
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

adminRouter.post("/course", (req, res) => {
  res.json({
    message: "course endpoint",
  });
});

adminRouter.put("/course", (req, res) => {
  res.json({
    message: "course endpoint",
  });
});

adminRouter.get("/course/all", (req, res) => {
  res.json({
    message: "course endpoint",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
