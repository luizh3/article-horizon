const express = require("express");
const router = express.Router();

const { ArticleAppraiser, Article } = require("../models");

const UserTypeEnum = require("../enums/UserTypeEnum");
const UserController = require("../controllers/UserController");
const ArticleAppraiserController = require("../controllers/ArticleAppraiserController");
const ArticleStatusEnum = require("../enums/ArticleStatusEnum");

router.get("/:name?", async (req, res) => {
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
});

router.get("/create/:idArticle", async (req, res) => {
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
});

router.post("/create/:idArticle", async (req, res) => {
  const { idArticle } = req.params;

  var idAppraisersNew = Array.isArray(req.body.options)
    ? req.body.options
    : [req.body.options];

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

  console.log(idAppraisersActual);

  await ArticleAppraiser.destroy({
    where: {
      id_appraiser: idAppraisersActual.filter(
        (idAppraiser) =>
          !hasAppraisers || !idAppraisersNew.includes(idAppraiser)
      ),
    },
  });

  if (hasAppraisers) {
    await ArticleAppraiser.bulkCreate(
      idAppraisersNew
        .filter((idAppraiser) => !idAppraisersActual.includes(idAppraiser))
        .map((idAppraiser) => {
          return {
            id_article: idArticle,
            id_appraiser: idAppraiser,
          };
        })
    );
  }

  await Article.update(
    {
      tp_status: hasAppraisers
        ? ArticleStatusEnum.REVISAO
        : ArticleStatusEnum.PENDENTE,
    },
    {
      where: {
        id_article: idArticle,
      },
    }
  );

  res.redirect("/article/list");
});

router.post("/score/:idArticle", async (req, res) => {
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

  const appraisers = await ArticleAppraiserController.findAllByIdArticle(
    idArticle
  );

  const nrFinalScoreArticle =
    appraisers.reduce((sum, appraiser) => {
      return sum + parseFloat(appraiser.finalScore);
    }, 0.0) / appraisers.length;

  console.log(nrFinalScoreArticle);

  await Article.update(
    {
      nr_score: nrFinalScoreArticle,
    },
    {
      where: {
        id_article: idArticle,
      },
    }
  );

  res.redirect(`/article/view/${idArticle}`);
});

module.exports = router;
