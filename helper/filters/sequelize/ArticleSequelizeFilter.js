const TypeScoreFilterEnum = require("../../../enums/filters/TypeScoreFilterEnum");
const sequelize = require("sequelize");

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
        ds_title: {
          [sequelize.Op.like]: `%${search}%`,
        },
      },
    };
  }

  return query;
}

module.exports = {
  searchOrderScore,
};
