const { Article } = require("../models");

const ArticleAuthorController = require("../controllers/ArticleAuthorController");
const ArticleAppraiserController = require("../controllers/ArticleAppraiserController");
const DataHelper = require("../helper/DateHelper");
const ArticleHelper = require("../helper/ArticleHelper");

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
      status: {
        type: current.tp_status,
        description: ArticleHelper.statusToString(current.tp_status),
      },
      created: DataHelper.format(current.dh_created),
    };
  });

  const authors = await ArticleAuthorController.findAllByIdArticle(id);
  const appraisers = await ArticleAppraiserController.findAllByIdArticle(id);

  return {
    ...article,
    authors,
    appraisers,
  };
}

module.exports = {
  findById,
};
