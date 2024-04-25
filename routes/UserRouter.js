const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const UserHelper = require("../helper/UserHelper");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const UserTypeEnum = require("../enums/UserTypeEnum");
const UserSequelizeFilter = require("../helper/filters/sequelize/UserSequelizeFilter");

router.get(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN]),
  (req, res) => {
    return res.render("pages/user/create", {
      view: {
        title: "Cadastrar usuario",
        description: "Esta pagina destina-se a criação de novos usuarios.",
        authorsSelect: UserHelper.userTypes(),
        action: "/user/create",
      },
    });
  }
);

router.post(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const user = req.body;

    const { hasUsername, hasEmail } = await UserController.hasUserRegister(
      user
    );

    console.log(hasUsername);
    console.log(hasEmail);

    if (!hasUsername && !hasEmail) {
      const userInsert = await UserController.insert(user);

      if (userInsert === null) {
        console.error("Falha ao registrar usuario");
        // TODO tratar erro
      }

      res.redirect("/user/list");

      return;
    }

    res.render("pages/user/create", {
      user: {
        ...req.body,
      },
      view: {
        title: "Cadastrar usuario",
        description: "Esta pagina destina-se a criação de novos usuarios.",
        authorsSelect: UserHelper.userTypesSelected(parseInt(req.body.type)),
        action: "/user/create",
      },
      errors: {
        email: {
          text: hasEmail ? "Esse e-mail ja esta cadastrado" : "",
        },
        username: {
          text: hasUsername ? "Esse usuario ja esta cadastrado" : "",
        },
      },
    });
  }
);

router.get(
  "/update/:id",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN]),
  async (req, res) => {
    const user = await UserController.findById(req.params.id);

    return res.render("pages/user/create", {
      user,
      view: {
        title: "Editar usuario",
        description: "Esta pagina destina-se a editar usuarios existentes.",
        authorsSelect: UserHelper.userTypesSelected(user.type),
        action: `/user/update/${user.id}`,
      },
    });
  }
);

router.post(
  "/update/:id",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const user = { id: req.params.id, ...req.body };
    await UserController.updateById(user);
    res.redirect("/user/list");
  }
);

router.get(
  "/list",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN]),
  async (req, res) => {
    const { search, typeUser } = req.query;

    console.log(req.query);

    const users = await UserController.findAll(
      UserSequelizeFilter.searchNameAndUserType(search, typeUser)
    );
    res.render("pages/user/list", {
      users,
      filters: {
        user: {
          types: UserHelper.userTypes(),
        },
      },
    });
  }
);

router.get(
  "/delete/:id",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    await UserController.removeById(req.params.id);
    res.redirect("/user/list");
  }
);

module.exports = router;
