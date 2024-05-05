const sequelize = require("sequelize");

const TypeScoreFilterEnum = require("@root/enums/filters/TypeScoreFilterEnum");
const SequelizeFilterHelper = require("./SequelizeFilterHelper");

function searchOrderScore(search, typeScoreFilter) {
  var query = {
    order: [
      [
        "nr_score",
        TypeScoreFilterEnum.toString(
          typeScoreFilter ?? TypeScoreFilterEnum.DESC
        ),
      ],
    ],
  };

  if (search !== "" && search !== undefined) {
    query = {
      ...query,
      where: {
        [sequelize.Op.and]: SequelizeFilterHelper.likeLowerCase(
          search,
          "ds_title"
        ),
      },
    };
  }

  return query;
}

module.exports = {
  searchOrderScore,
};
