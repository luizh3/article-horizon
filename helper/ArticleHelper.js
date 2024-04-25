const ArticleStatusEnum = require("../enums/ArticleStatusEnum");

function statusArticleToTypeBadge(status) {
  switch (status) {
    case ArticleStatusEnum.PENDENTE:
    case ArticleStatusEnum.REVISAO: {
      return "warning";
    }
    case ArticleStatusEnum.UNKNOW:
    case ArticleStatusEnum.REJEITADO: {
      return "invalid";
    }
    default:
      return "";
  }
}

module.exports = {
  statusArticleToTypeBadge,
};
