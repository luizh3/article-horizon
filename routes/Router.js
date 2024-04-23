const express = require("express");
const router = express.Router();

const loginRouter = require("./LoginRouter");
const articleRouter = require("./ArticleRouter");
const userRouter = require("./UserRouter");

const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");

router.use("/login", loginRouter);
router.use("/article", articleRouter);
router.use("/user", userRouter);

router.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home-logged");
    return;
  }

  res.render("home", { layout: "main-clean" });
});

router.get(
  "/logout",
  AuthenticationMiddleware.isAuthenticated(),
  (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        res.status(400).send("Unable to logout");
      } else {
        res.redirect("/login");
      }
    });
  }
);

module.exports = router;
