const { Router } = require("express");
const { AdminModel, CourseModel } = require("../db");
require("dotenv").config({ path: __dirname + "/../.env" });
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminRouter = Router();
const { adminMiddleware } = require("../middlewares/admin_auth");

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

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price } = req.body;

  const course = await CourseModel.create({
    title,
    description,
    imageUrl,
    price,
    creatorId: adminId,
  });

  res.json({
    message: "Course Created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body;
  const course = await CourseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title,
      description,
      imageUrl,
      price,
    }
  );
  res.json({
    message: "Course Updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/all", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courses = await CourseModel.find({
    creatorId: adminId,
  });
  res.json({
    courses,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
