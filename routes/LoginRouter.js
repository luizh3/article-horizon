const express = require("express");
const router = express.Router();

const loginController = require("../controllers/LoginController");

router.get("/", (req, res) => {
  return res.render("pages/login", { layout: "main-clean" });
});

router.post("/", async (req, res) => {
  const { hasEmail, hasPassword, user } = await loginController.onLogin(
    req.body
  );

  if (!hasEmail) {
    res.render("pages/login", {
      layout: "main-clean",
      email: req.body.email,
      errors: {
        email: {
          text: "E-mail não encontrado. ",
        },
      },
    });
    return;
  }

  if (!hasPassword) {
    res.render("pages/login", {
      layout: "main-clean",
      email: req.body.email,
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
  };

  res.redirect("/");
  return;
});

module.exports = router;
