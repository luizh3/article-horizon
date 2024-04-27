const express = require("express");
const router = express.Router();

const { ArticleAppraiser, Article } = require("../models");

const UserTypeEnum = require("../enums/UserTypeEnum");
const UserController = require("../controllers/UserController");
const ArticleAppraiserController = require("../controllers/ArticleAppraiserController");
const ArticleStatusEnum = require("../enums/ArticleStatusEnum");
const ArticleController = require("../controllers/ArticleController");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");

router.get(
  "/:name?",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN]),
  async (req, res) => {
    const { name } = req.params;
    const hasName = name !== undefined && name !== "";

    var appraisers = {};

    if (hasName) {
      appraisers = await UserController.findByNameAndType(
        name,
        UserTypeEnum.AVALIADOR
      );
    } else {
      appraisers = (
        await UserController.findAll({
          where: { tp_user: UserTypeEnum.AVALIADOR },
        })
      ).map((current) => {
        return { id: current.id, name: current.name };
      });
    }

    res.json(appraisers);
  }
);

router.get(
  "/create/:idArticle",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN]),
  async (req, res) => {
    const { idArticle } = req.params;

    const appraisers = (
      await ArticleAppraiserController.findAllByIdArticle(idArticle)
    ).map((current) => {
      return {
        id: current.idAppraiser,
        description: current.name,
      };
    });

    res.render("pages/appraiser/create", {
      view: {
        idArticle,
        appraiser: {
          search: {
            href: `${process.env.API_URL}/appraiser/`,
          },
          selecteds: appraisers,
        },
      },
    });
  }
);

async function onErrorLimitAppraisers(
  idArticle,
  idAppraisersNew,
  nrMaxAppraiersArticle,
  response
) {
  const appraisers = (
    await UserController.findAll({
      where: {
        id_user: idAppraisersNew,
      },
    })
  ).map((appraiser) => {
    return { id: appraiser.id, description: appraiser.name };
  });

  response.render("pages/appraiser/create", {
    view: {
      idArticle,
      appraiser: {
        search: {
          href: `${process.env.API_URL}/appraiser/`,
        },
        selecteds: appraisers,
      },
    },
    errors: {
      appraiser: {
        text: `O limite de avaliador por arigo é ${nrMaxAppraiersArticle}`,
      },
    },
  });
}

router.post(
  "/create/:idArticle",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const { idArticle } = req.params;

    var idAppraisersNew = Array.isArray(req.body.options)
      ? req.body.options
      : [req.body.options];

    idAppraisersNew = idAppraisersNew.map((idAppraiser) =>
      parseInt(idAppraiser)
    );

    const nrMaxAppraiersArticle = 3;

    if (idAppraisersNew.length > nrMaxAppraiersArticle) {
      onErrorLimitAppraisers(
        idArticle,
        idAppraisersNew,
        nrMaxAppraiersArticle,
        res
      );
      return;
    }

    const hasAppraisers =
      req.body.options !== undefined && idAppraisersNew.length > 0;

    const idAppraisersActual = await ArticleAppraiser.findAll({
      attributes: ["id_appraiser"],
      where: {
        id_article: idArticle,
      },
    })
      .then((appraisers) => {
        return appraisers.map((appraiser) => {
          return appraiser.dataValues.id_appraiser;
        });
      })
      .catch((error) => console.log(error));

    const idsDelete = idAppraisersActual.filter(
      (idAppraiser) => !hasAppraisers || !idAppraisersNew.includes(idAppraiser)
    );

    await ArticleAppraiser.destroy({
      where: {
        id_article: idArticle,
        id_appraiser: idsDelete,
      },
    });

    const newAuthors = idAppraisersNew
      .filter((idAppraiser) => !idAppraisersActual.includes(idAppraiser))
      .map((idAppraiser) => {
        return {
          id_article: idArticle,
          id_appraiser: idAppraiser,
        };
      });

    if (hasAppraisers) {
      await ArticleAppraiser.bulkCreate(newAuthors);
    }

    const nrFinalScore = await ArticleAppraiserController.nrScoreByIdArticle(
      idArticle
    );

    await Article.update(
      {
        tp_status: hasAppraisers
          ? ArticleStatusEnum.REVISAO
          : ArticleStatusEnum.PENDENTE,
        nr_score: nrFinalScore,
      },
      {
        where: {
          id_article: idArticle,
        },
      }
    );

    res.redirect("/article/list");
  }
);

router.post(
  "/score/:idArticle",
  AuthenticationMiddleware.checkRole([UserTypeEnum.AVALIADOR], true),
  async (req, res) => {
    const idArticle = req.params.idArticle;
    const idUserSession = req.session.user.id;

    const { experienceScore, relevantScore } = req.body;

    const nrFinalScore = (
      parseFloat(experienceScore) * parseFloat(relevantScore)
    ).toFixed(2);

    await ArticleAppraiser.update(
      {
        nr_experience_score: experienceScore,
        nr_relevant_score: relevantScore,
        nr_final_score: nrFinalScore,
        fg_rated: true,
      },
      {
        where: {
          id_appraiser: idUserSession,
          id_article: idArticle,
        },
      }
    );

    await ArticleController.updateNrScoreByIdArticle(idArticle);

    res.redirect(`/article/view/${idArticle}`);
  }
);

module.exports = router;
