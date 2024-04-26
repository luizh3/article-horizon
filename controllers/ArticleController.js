const { Article } = require("../models");

const ArticleAuthorController = require("../controllers/ArticleAuthorController");
const ArticleAppraiserController = require("../controllers/ArticleAppraiserController");
const DateHelper = require("../helper/DateHelper");
const ArticleStatusEnum = require("../enums/ArticleStatusEnum");

async function findById(id) {
  const authors = await ArticleAuthorController.findAllByIdArticle(id);
  const appraisers = await ArticleAppraiserController.findAllByIdArticle(id);

  const article = await Article.findByPk(id).then((current) => {
    if (current === null) {
      return null;
    }

    return {
      id: current.id_article,
      title: current.ds_title,
      summary: current.ds_summary,
      linkPdf: current.link_pdf,
      idCreatorAuthor: current.id_creator_author,
      created: DateHelper.format(current.dh_created),
      totalScore: current.nr_score,
      status: {
        type: current.tp_status,
        description: ArticleStatusEnum.toString(current.tp_status),
      },
    };
  });

  return {
    ...article,
    authors,
    appraisers,
  };
}

async function findAll(filters = {}) {
  return await Article.findAll(filters)
    .then((articles) => {
      return articles.map((current) => {
        const data = current.dataValues;
        return {
          id: data.id_article,
          title: data.ds_title,
          summary: data.ds_summary,
          created: DateHelper.format(data.dh_created),
          totalScore: data.nr_score,
          idCreatorAuthor: data.id_creator_author,
          status: {
            type: current.tp_status,
            description: ArticleStatusEnum.toString(current.tp_status),
          },
        };
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

async function updateById(article) {
  await Article.update(
    {
      ds_title: article.title,
      link_pdf: article.linkPdf,
      ds_summary: article.summary,
    },
    {
      where: {
        id_article: article.idArticle,
      },
    }
  );
}

async function updateNrScoreByIdArticle(idArticle) {
  const nrFinalScoreArticle =
    await ArticleAppraiserController.nrScoreByIdArticle(idArticle);

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
}

module.exports = {
  findById,
  findAll,
  updateById,
  updateNrScoreByIdArticle,
};
