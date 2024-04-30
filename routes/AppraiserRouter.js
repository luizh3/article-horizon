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
        text: `O limite de avaliador por artigo é ${nrMaxAppraiersArticle}`,
      },
    },
  });
}

router.post(
  "/create/:idArticle",
  AuthenticationMiddleware.checkRole([UserTypeEnum.ADMIN], true),
  async (req, res) => {
    const { idArticle } = req.params;
    const optionAppraisers = req.body.options;
    const hasAppraisers = optionAppraisers !== undefined;

    var idAppraisersNew = [];

    if (hasAppraisers) {
      idAppraisersNew = Array.isArray(optionAppraisers)
        ? optionAppraisers.map((idAppraiser) => parseInt(idAppraiser))
        : [parseInt(optionAppraisers)];
    }

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

    const idAppraisersActual =
      await ArticleAppraiserController.idAppraisersByIdArtigo(idArticle);

    const isSameValues =
      idAppraisersActual.length === idAppraisersNew.length &&
      idAppraisersNew.every((idAppraiser) =>
        idAppraisersActual.includes(idAppraiser)
      );

    if (isSameValues) {
      res.redirect("/article/list");
      return;
    }

    const idsDelete = idAppraisersActual.filter(
      (idAppraiser) => !hasAppraisers || !idAppraisersNew.includes(idAppraiser)
    );

    await ArticleAppraiser.destroy({
      where: {
        id_article: idArticle,
        id_appraiser: idsDelete,
      },
    });

    const newAppraisers = idAppraisersNew
      .filter((idAppraiser) => !idAppraisersActual.includes(idAppraiser))
      .map((idAppraiser) => {
        return {
          id_article: idArticle,
          id_appraiser: idAppraiser,
        };
      });

    if (hasAppraisers) {
      await ArticleAppraiser.bulkCreate(newAppraisers);
    }

    const nrFinalScore = await ArticleAppraiserController.nrScoreByIdArticle(
      idArticle
    );

    const isAllRated = await ArticleAppraiserController.isAllRatedByIdArticle(
      idArticle
    );

    const statusArticle = isAllRated
      ? ArticleStatusEnum.REVISAO
      : hasAppraisers
      ? ArticleStatusEnum.AVALIACAO
      : ArticleStatusEnum.PENDENTE;

    await Article.update(
      {
        tp_status: statusArticle,
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

    const isAllRated = await ArticleAppraiserController.isAllRatedByIdArticle(
      idArticle
    );

    if (isAllRated) {
      await ArticleController.updateStatusArticle(
        ArticleStatusEnum.REVISAO,
        idArticle
      );
    }

    res.redirect(`/article/view/${idArticle}`);
  }
);

module.exports = router;
