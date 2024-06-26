const { Article } = require("@root/models");

const ArticleAuthorController = require("@root/controllers/ArticleAuthorController");
const ArticleAppraiserController = require("@root/controllers/ArticleAppraiserController");
const DateHelper = require("@root/helper/DateHelper");
const ArticleStatusEnum = require("@root/enums/ArticleStatusEnum");

async function findById(id) {
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

  if (article === null) {
    return null;
  }

  const authors = await ArticleAuthorController.findAllByIdArticle(id);
  const appraisers = await ArticleAppraiserController.findAllByIdArticle(id);

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

async function updateNrScoreByIdArticles(idArticles) {
  await idArticles.forEach(async (idArticle) => {
    await updateNrScoreByIdArticle(idArticle);
  });
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

async function updateStatusArticle(tpStatus, idArticle) {
  await Article.update(
    {
      tp_status: tpStatus,
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
  updateNrScoreByIdArticles,
  updateStatusArticle,
};
