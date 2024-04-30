const ArticleStatusEnum = require("../enums/ArticleStatusEnum");

function statusArticleToTypeBadge(status) {
  switch (status) {
    case ArticleStatusEnum.PENDENTE:
    case ArticleStatusEnum.AVALIACAO:
    case ArticleStatusEnum.REVISAO: {
      return "warning";
    }
    case ArticleStatusEnum.UNKNOW:
    case ArticleStatusEnum.REJEITADO: {
      return "invalid";
    }
    case ArticleStatusEnum.ACEITO: {
      return "valid";
    }
    default:
      return "";
  }
}

function isFinished(type) {
  return [ArticleStatusEnum.ACEITO, ArticleStatusEnum.REJEITADO].includes(type);
}

module.exports = {
  statusArticleToTypeBadge,
  isFinished,
};
