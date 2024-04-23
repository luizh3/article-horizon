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
          name: appraiser.User.ds_name,
          email: appraiser.User.ds_email,
        };
      });
    })
    .catch((error) => console.error(error));
}

module.exports = {
  findAllByIdArticle,
};
