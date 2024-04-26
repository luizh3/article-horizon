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
const ArticleStatusEnum = require("../enums/ArticleStatusEnum");
const RegexHelper = require("../helper/RegexHelper");

function viewCreateProperties() {
  return {
    view: {
      title: "Criar artigo",
      description:
        "Esta informação será exibido publicamente, então tome cuidado com o que você compartilha.",
      form: {
        action: `/article/create`,
      },
    },
  };
}

router.get(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR]),
  (req, res) => {
    res.render("pages/article/create", viewCreateProperties());
  }
);

async function isValidLimitAuthors(
  idAuthors,
  idUserSession,
  response,
  article
) {
  const nrMaxAuthorsArticle = 5;

  if (!(idAuthors.length >= nrMaxAuthorsArticle)) {
    return true;
  }

  const authors = (
    await UserController.findAll({
      where: {
        id_user: idAuthors.filter((idAuthor) => idAuthor !== idUserSession),
      },
    })
  ).map((author) => {
    return { id: author.id, name: author.name };
  });

  response.render("pages/article/create", {
    ...viewCreateProperties(),
    article: { ...article, authors },
    errors: {
      author: {
        text: `O limite de autor por arigo é ${nrMaxAuthorsArticle} contando você`,
      },
    },
  });

  return false;
}

router.post(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    var { title, linkPdf, summary, authors: idAuthors } = req.body;

    const idUserSession = req.session.user.id;

    if (Array.isArray(idAuthors)) {
      idAuthors.push(idUserSession);
    } else {
      idAuthors =
        idAuthors !== undefined
          ? [idAuthors, toString(req.session.user.id)]
          : [toString(req.session.user.id)];
    }

    const article = {
      title,
      linkPdf,
      summary,
    };

    if (!isValidLimitAuthors(idAuthors, idUserSession, res, article)) {
      return;
    }

    const articleCreated = await Article.create({
      ds_title: title,
      ds_summary: summary,
      link_pdf: linkPdf,
      dh_created: new Date(),
      id_creator_author: idUserSession,
    });

    const authorsInsert = idAuthors.map((idAuthor) => {
      return {
        id_article: articleCreated.id_article,
        id_author: idAuthor,
      };
    });

    await ArticleAuthor.bulkCreate(authorsInsert);

    res.redirect("/article/list");
  }
);

router.get(
  "/view/:id",
  AuthenticationMiddleware.isAuthenticated(),
  async (req, res) => {
    const article = await ArticleController.findById(req.params.id);

    const idUserSession = req.session.user.id;

    const isArticleRated =
      article.appraisers.length > 0 &&
      article.appraisers.every((appraiser) => appraiser.rated);

    const appraiserSession = article.appraisers.filter(
      (current) => current.idAppraiser === idUserSession
    )[0];

    res.render("pages/article/information", {
      article,
      view: {
        buttons: {
          delete: {
            href: `/article/delete/${article.id}`,
          },
          update: {
            href: res.locals.userSession.isAdmin
              ? `/appraiser/create/${article.id}`
              : `/article/update/${article.id}`,
          },
          accepted: {
            href: `/article/status?idArticle=${article.id}&tpStatus=${ArticleStatusEnum.ACEITO}`,
          },
          reject: {
            href: `/article/status?idArticle=${article.id}&tpStatus=${ArticleStatusEnum.REJEITADO}`,
          },
        },
        inputs: {
          score: {
            regex: RegexHelper.only.number.range.decimal(10),
          },
        },
        article: {
          isOpen: !ArticleHelper.isFinished(article.status.type),
        },
        appraiser: {
          isArticleNotRated: !isArticleRated,
          session: appraiserSession,
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
        return appraisers.map((appraiser) => appraiser.idAppraiser);
      },
    });
  }
);

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

router.get(
  "/update/:id",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR]),
  async (req, res) => {
    const { id } = req.params;

    const idCurrentUser = req.session.user.id;

    var article = await ArticleController.findById(id);

    article = {
      ...article,
      authors: article.authors.filter(
        (current) => current.id !== idCurrentUser
      ),
    };

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
  }
);

router.post(
  "/update/:idArticle",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    const { idArticle } = req.params;

    console.log(`Id Artigo ${idArticle}`);

    const article = req.body;
    const idUserSession = req.session.user.id;
    var idAuthors = article.authors;

    if (!Array.isArray(idAuthors)) {
      idAuthors = [idAuthors];
    }

    const idCreatorAuthor = await Article.findByPk(idArticle).then(
      (articleDatabase) => {
        return articleDatabase
          ? articleDatabase.dataValues.id_creator_author
          : 0;
      }
    );

    const idAuthorsWithCreator = [...idAuthors, idCreatorAuthor];

    console.log(idAuthorsWithCreator);

    if (
      isValidLimitAuthors(idAuthorsWithCreator, idUserSession, res, article)
    ) {
      console.log("return 1312312312");
      return;
    }

    ArticleController.updateById({
      ...article,
      idArticle,
    });

    await ArticleAuthor.destroy({
      where: {
        id_article: idArticle,
        id_author: idAuthors,
      },
    });

    await ArticleAuthor.bulkCreate(
      idAuthors.map((idAuthor) => {
        return {
          id_article: idArticle,
          id_author: idAuthor,
        };
      })
    );

    res.redirect("/article/list");
  }
);

router.post(
  "/status",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const { idArticle, tpStatus } = req.query;

    console.log(idArticle, tpStatus);

    await Article.update(
      {
        tp_status: tpStatus,
      },
      {
        where: {
          id_article: idArticle,
        },
      }
    );

    res.redirect(`/article/view/${idArticle}`);
  }
);

module.exports = router;
