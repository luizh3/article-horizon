const express = require("express");
const router = express.Router();

const LoginRouter = require("./LoginRouter");
const ArticleRouter = require("./ArticleRouter");
const UserRouter = require("./UserRouter");
const AppraiserRouter = require("./AppraiserRouter");
const UserTypeEnum = require("../enums/UserTypeEnum");

const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");

router.use("/login", LoginRouter);
router.use("/article", ArticleRouter);
router.use("/user", UserRouter);
router.use("/appraiser", AppraiserRouter);

function artigoOptions(user) {
  const listElement = {
    icon: "list_alt",
    description: "Listar",
    href: "/article/list",
  };

  const createElement = {
    icon: "add_circle",
    description: "Criar",
    href: "/article/create",
  };

  var elementsByTypeUser = new Map([
    [UserTypeEnum.ADMIN, [listElement]],
    [UserTypeEnum.AVALIADOR, [listElement]],
    [UserTypeEnum.AUTOR, [listElement, createElement]],
  ]);

  const cardOptions = elementsByTypeUser.get(user.type) ?? [];

  if (cardOptions.length > 0) {
    return {
      description: "Artigos",
      cards: cardOptions,
    };
  }

  return null;
}

function userOptions(user) {
  const listElement = {
    icon: "list_alt",
    description: "Listar",
    href: "/user/list",
  };

  const createElement = {
    icon: "add_circle",
    description: "Criar",
    href: "/user/create",
  };

  var elementsByTypeUser = new Map([
    [UserTypeEnum.ADMIN, [listElement, createElement]],
  ]);

  const cardOptions = elementsByTypeUser.get(user.type) ?? [];

  if (cardOptions.length > 0) {
    return {
      description: "Usuarios",
      cards: cardOptions,
    };
  }

  return null;
}

function homeOptions(userSession) {
  const artigoElements = artigoOptions(userSession);
  const userElements = userOptions(userSession);

  var options = {};

  if (artigoElements) {
    options = { artigoElements };
  }

  if (userElements) {
    options = { ...options, userElements };
  }

  return options;
}

router.get("/", (req, res) => {
  const userSession = req.session.user;

  if (userSession) {
    res.render("home-logged", {
      options: homeOptions(userSession),
    });
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
