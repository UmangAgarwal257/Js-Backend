const { Router } = require("express");
const { CourseModel, PurchaseModel } = require("../db");
const { user_Middleware } = require("../middlewares/user_auth");

const courseRouter = Router();

courseRouter.post("/purchase", user_Middleware, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  await PurchaseModel.create({
    userId,
    courseId,
  });

  res.json({
    message: "You have successfully purchased the course ",
  });
});

courseRouter.get("/preview", async (req, res) => {
  const courses = await CourseModel.find({});

  res.json({
    courses,
  });
});

module.exports = {
  courseRouter: courseRouter,
};
