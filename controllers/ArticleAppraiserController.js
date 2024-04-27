const { ArticleAppraiser } = require("../models");

async function findAllByIdArticle(id) {
  return ArticleAppraiser.findAll({
    where: {
      id_article: id,
    },
    include: ["User"],
  })
    .then((appraisers) => {
      return appraisers.map((appraiser) => {
        return {
          idAppraiser: appraiser.id_appraiser,
          rated: appraiser.fg_rated,
          relevantScore: appraiser.nr_relevant_score,
          experienceScore: appraiser.nr_experience_score,
          finalScore: appraiser.nr_final_score,
          name: appraiser.User.ds_name,
          email: appraiser.User.ds_email,
        };
      });
    })
    .catch((error) => console.error(error));
}

async function nrScoreByIdArticle(idArticle) {
  const appraisers = await findAllByIdArticle(idArticle);

  if (appraisers.length === 0) {
    return 0.0;
  }

  const nrAppraiserRated = appraisers.filter(
    (appraiser) => appraiser.rated
  ).length;

  return (
    appraisers.reduce((sum, appraiser) => {
      return sum + parseFloat(appraiser.finalScore);
    }, 0.0) / nrAppraiserRated
  );
}

async function findIdArtigosByIdAppraiser(idAppraiser) {
  return await ArticleAppraiser.findAll({
    attributes: ["id_article"],
    where: {
      id_appraiser: idAppraiser,
    },
  })
    .then((articleAppraisers) => {
      return articleAppraisers.map((articleAppraiser) => {
        return articleAppraiser.dataValues.id_article;
      });
    })
    .catch((error) => console.error(error));
}

async function removeByIdAppraiser(id) {
  await ArticleAppraiser.destroy({
    where: {
      id_appraiser: id,
    },
  });
}

module.exports = {
  findAllByIdArticle,
  nrScoreByIdArticle,
  removeByIdAppraiser,
  findIdArtigosByIdAppraiser,
};
