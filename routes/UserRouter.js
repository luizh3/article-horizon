const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const ArticleAppraiserController = require("../controllers/ArticleAppraiserController");
const ArticleAuthorController = require("../controllers/ArticleAuthorController");
const ArticleController = require("../controllers/ArticleController");

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
        user: {
          password: {
            required: true,
          },
        },
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
        user: {
          password: {
            required: false,
          },
        },
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

    const users = await UserController.findAll(
      UserSequelizeFilter.searchNameAndUserType(search, typeUser)
    );
    res.render("pages/user/list", {
      users,
      filters: {
        user: {
          types: UserHelper.userTypes(),
          search: search,
        },
      },
    });
  }
);

router.get(
  "/delete/:id",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const idUser = parseInt(req.params.id);

    // TODO change for user associations of sequelize

    const user = await UserController.findById(idUser);

    if (user === null) {
      return;
    }

    if (user.type === UserTypeEnum.AUTOR) {
      await ArticleAuthorController.removeByIdAutor(idUser);
    }

    if (user.type === UserTypeEnum.AVALIADOR) {
      const idArtigos =
        await ArticleAppraiserController.findIdArtigosByIdAppraiser(idUser);

      await ArticleAppraiserController.removeByIdAppraiser(idUser);

      await ArticleController.updateNrScoreByIdArticles(idArtigos);
    }

    await UserController.removeById(idUser);

    res.redirect("/user/list");
  }
);

module.exports = router;
