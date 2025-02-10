const { Router } = require("express");
const { AdminModel } = require("../db");
const adminRouter = Router();

// adminRouter.use(adminMiddleware);

adminRouter.post("/signup", (req, res) => {
  res.json({
    message: "signup endpoint",
  });
});

adminRouter.post("/signin", (req, res) => {
  res.json({
    message: "signin endpoint",
  });
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
