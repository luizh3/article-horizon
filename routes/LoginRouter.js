const express = require("express");
const router = express.Router();

const loginController = require("../controllers/LoginController");
const {
  MAIN_CLEAN_LAYOUT_NAME,
} = require("../helper/constants/handlebarsConstants");

router.get("/", (req, res) => {
  return res.render("pages/Login", { layout: MAIN_CLEAN_LAYOUT_NAME });
});

router.post("/", async (req, res) => {
  const { hasIdentifier, hasPassword, user } = await loginController.onLogin(
    req.body
  );

  if (!hasIdentifier) {
    res.render("pages/Login", {
      layout: MAIN_CLEAN_LAYOUT_NAME,
      identifier: req.body.identifier,
      errors: {
        identifier: {
          text: "E-mail ou nome de usuario incorreto. ",
        },
      },
    });
    return;
  }

  if (!hasPassword) {
    res.render("pages/Login", {
      layout: MAIN_CLEAN_LAYOUT_NAME,
      identifier: req.body.identifier,
      errors: {
        password: {
          text: "Senha não confere.",
        },
      },
    });
    return;
  }

  req.session.user = {
    type: user.tp_user,
    id: user.id_user,
    name: user.ds_name,
  };

  res.redirect("/");
  return;
});

module.exports = router;
