const express = require("express");
const router = express.Router();

const { User, ArticleAuthor, Article } = require("../models");
const { Op } = require("sequelize");

const UserTypeEnum = require("../enums/UserTypeEnum");
const DateHelper = require("../helper/DateHelper");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const ArticleController = require("../controllers/ArticleController");
const ArticleStatusEnum = require("../enums/ArticleStatusEnum");

router.get(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR]),
  (req, res) => {
    res.render("pages/article/create");
  }
);

router.post(
  "/create",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    var { title, linkPdf, summary, authors } = req.body;

    const articleCreated = await Article.create({
      ds_title: title,
      ds_summary: summary,
      link_pdf: linkPdf,
      tp_status: 0,
      dh_created: new Date(),
    });

    if (Array.isArray(authors)) {
      console.log(req.session);
      authors.push(req.session.user.id);
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
  res.render("pages/article/information", {
    article,
    helpers: {
      authorsToRaw(list) {
        return list
          .map((current) => {
            return current.name;
          })
          .join(", ");
      },
    },
    statusArticleToTypeBadge(status) {
      switch (status) {
        case ArticleStatusEnum.REVISAO: {
          return "warning";
        }
        case ArticleStatusEnum.UNKNOW:
        case ArticleStatusEnum.REJEITADO: {
          return "invalid";
        }
        default:
          return "";
      }
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
    const articles = await Article.findAll()
      .then((articles) => {
        return articles.map((current) => {
          const data = current.dataValues;
          return {
            id: data.id_article,
            title: data.ds_title,
            summary: data.ds_summary,
            created: DateHelper.format(data.dh_created),
          };
        });
      })
      .catch((error) => {
        console.error(error);
      });

    res.render("pages/article/list", {
      articles: articles,
    });
  }
);

router.get(
  "/autor/:name",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AUTOR], true),
  async (req, res) => {
    const authors = await User.findAll({
      attributes: ["ds_name", "id_user"],
      where: {
        tp_user: UserTypeEnum.AUTOR,
        ds_name: {
          [Op.like]: `%${req.params.name}%`,
        },
      },
    })
      .then((users) => {
        return users
          .map((current) => {
            return { id: current.id_user, name: current.ds_name };
          })
          .filter((current) => current.id !== req.session.user.id);
      })
      .catch((error) => {
        console.error(error);
      });

    res.json(authors);
  }
);

module.exports = router;
