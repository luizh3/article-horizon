const { ArticleAuthor, User } = require("../models");

async function findAllByIdArticle(idArticle) {
  const authorsId = await ArticleAuthor.findAll({
    attributes: ["id_author"],
    where: {
      id_article: idArticle,
    },
  })
    .then((values) => {
      return values.map((current) => {
        return current.dataValues.id_author;
      });
    })
    .catch((error) => console.error(error));

  const authors = await User.findAll({
    attributes: ["ds_name", "id_user"],
    where: {
      id_user: authorsId,
    },
  }).then((users) =>
    users.map((current) => {
      const values = current.dataValues;
      return {
        id: values.id_user,
        name: values.ds_name,
      };
    })
  );

  return authors;
}

module.exports = {
  findAllByIdArticle,
};
