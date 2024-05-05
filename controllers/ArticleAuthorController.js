const { ArticleAuthor, User } = require("@root/models");

async function findAllByIdArticle(idArticle) {
  return await findAll({
    attributes: ["id_author"],
    include: {
      model: User,
      attributes: ["ds_name"],
    },
    where: {
      id_article: idArticle,
    },
  });
}

async function findAll(filters = {}) {
  return await ArticleAuthor.findAll(filters)
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

async function removeByIdAutor(id) {
  await ArticleAuthor.destroy({
    where: {
      id_author: id,
    },
  });
}

module.exports = {
  findAllByIdArticle,
  removeByIds,
  removeByIdAutor,
};
