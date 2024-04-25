const express = require("express");
const router = express.Router();

const LoginRouter = require("./LoginRouter");
const ArticleRouter = require("./ArticleRouter");
const UserRouter = require("./UserRouter");
const AppraiserRouter = require("./AppraiserRouter");

const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");

router.use("/login", LoginRouter);
router.use("/article", ArticleRouter);
router.use("/user", UserRouter);
router.use("/appraiser", AppraiserRouter);

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
