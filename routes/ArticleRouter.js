const express = require("express");
const router = express.Router();

const { ArticleAuthor, Article } = require("../models");

const UserTypeEnum = require("../enums/UserTypeEnum");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const ArticleController = require("../controllers/ArticleController");
const ArticleFilters = require("../helper/filters/view/ArticleFilters");
const ArticleSequelizeFilter = require("../helper/filters/sequelize/ArticleSequelizeFilter");
const UserController = require("../controllers/UserController");
const ArticleHelper = require("../helper/ArticleHelper");
const ArticleAuthorController = require("../controllers/ArticleAuthorController");

router.get(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR]),
  (req, res) => {
    res.render("pages/article/create", {
      view: {
        title: "Criar artigo",
        description:
          "Esta informação será exibido publicamente, então tome cuidado com o que você compartilha.",
        form: {
          action: `/article/create`,
        },
      },
    });
  }
);

router.post(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    var { title, linkPdf, summary, authors } = req.body;

    const idUserSession = req.session.user.id;

    const articleCreated = await Article.create({
      ds_title: title,
      ds_summary: summary,
      link_pdf: linkPdf,
      dh_created: new Date(),
      id_creator_author: idUserSession,
    });

    if (Array.isArray(authors)) {
      authors.push(idUserSession);
    } else {
      authors =
        authors !== undefined
          ? [authors, req.session.user.id]
          : [req.session.user.id];
    }

    const authorsInsert = authors.map((idAuthor) => {
      return {
        id_article: articleCreated.id_article,
        id_author: idAuthor,
      };
    });

    await ArticleAuthor.bulkCreate(authorsInsert);

    res.redirect("/article/list");
  }
);

router.get("/view/:id", async (req, res) => {
  const article = await ArticleController.findById(req.params.id);

  const idUserSession = req.session.user.id;

  res.render("pages/article/information", {
    article,
    view: {
      delete: {
        href: `/article/delete/${article.id}`,
      },
      update: {
        href: res.locals.userSession.isAdmin
          ? `/appraiser/create/${article.id}`
          : `/article/update/${article.id}`,
      },
      appraiser: {
        update: {
          href: `/appraiser/score/${article.id}`,
        },
      },
    },
    helpers: {
      authorsToRaw(list) {
        return list
          .map((current) => {
            return current.name;
          })
          .join(", ");
      },
    },
    statusArticleToTypeBadge: (status) => {
      return ArticleHelper.statusArticleToTypeBadge(status);
    },
    idAppraisers: (appraisers) => {
      return appraisers.map((current) => current.idAppraiser);
    },
    sessionAppraiser: (appraisers) => {
      console.log(appraisers);
      const appraiser = appraisers.filter(
        (current) => current.idAppraiser === idUserSession
      )[0];

      return appraiser;
    },
  });
});

router.get(
  "/delete/:id",
  AuthenticationMiddleware.checkRole(
    [UserTypeEnum.AUTOR, UserTypeEnum.ADMIN],
    true
  ),
  async (req, res) => {
    console.log(`ID: ${req.params.id}`);

    await Article.destroy({
      where: {
        id_article: req.params.id,
      },
    });

    res.redirect("/article/list");
  }
);

router.get(
  "/list",
  AuthenticationMiddleware.isAuthenticated(),
  async (req, res) => {
    const { search, typeScoreFilter } = req.query;

    const articles = await ArticleController.findAll(
      ArticleSequelizeFilter.searchOrderScore(search, typeScoreFilter)
    );

    res.render("pages/article/list", {
      articles: articles,
      isAdmin: true,
      filters: {
        score: ArticleFilters.scoreOrder(),
      },
      helpers: {
        statusArticleToTypeBadge: (status) => {
          return ArticleHelper.statusArticleToTypeBadge(status);
        },
      },
    });
  }
);

router.get(
  "/autor/:name?",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    const { name } = req.params;
    const idCurrentUser = req.session.user.id;

    const hasName = name !== undefined && name !== "";

    var authors = {};

    if (hasName) {
      authors = (
        await UserController.findByNameAndType(name, UserTypeEnum.AUTOR)
      ).filter((current) => current.id !== idCurrentUser);
    } else {
      authors = (
        await UserController.findAll({
          where: { tp_user: UserTypeEnum.AUTOR },
        })
      )
        .filter((current) => current.id !== idCurrentUser)
        .map((current) => {
          return { id: current.id, name: current.name };
        });
    }

    res.json(authors);
  }
);

router.get("/update/:id", async (req, res) => {
  const { id } = req.params;

  const article = await ArticleController.findById(id);

  res.render("pages/article/create", {
    article,
    view: {
      title: "Editar artigo",
      description:
        "Esta informação será exibido publicamente, então tome cuidado com o que você compartilha.",
      form: {
        action: `/article/update/${id}`,
      },
    },
  });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;

  const user = req.body;
  var authors = user.authors;

  ArticleController.updateById({
    ...user,
    id,
  });

  await ArticleAuthor.destroy({
    where: {
      id_article: id,
    },
  });

  if (!Array.isArray(authors)) {
    authors = [authors];
  }

  await ArticleAuthor.bulkCreate(
    authors.map((idAuthor) => {
      return {
        id_article: id,
        id_author: idAuthor,
      };
    })
  );

  res.redirect("/article/list");
});

module.exports = router;
