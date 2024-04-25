const { ArticleAuthor, User } = require("../models");

async function findAllByIdArticle(idArticle) {
  return await ArticleAuthor.findAll({
    attributes: ["id_author"],
    include: {
      model: User,
      attributes: ["ds_name"],
    },
    where: {
      id_article: idArticle,
    },
  })
    .then((values) => {
      return values.map((current) => {
        return {
          id: current.dataValues.id_author,
          name: current.User.dataValues.ds_name,
        };
      });
    })
    .catch((error) => console.error(error));
}

async function removeByIds(ids) {
  return await ArticleAuthor.destroy({ where: { id: ids } });
}

module.exports = {
  findAllByIdArticle,
  removeByIds,
};
