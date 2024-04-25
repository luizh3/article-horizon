const TypeScoreFilterEnum = require("../../../enums/filters/TypeScoreFilterEnum");

function scoreOrder() {
  return {
    options: [
      {
        id: TypeScoreFilterEnum.DESC,
        description: "Maior nota",
      },
      {
        id: TypeScoreFilterEnum.ASC,
        description: "Menor nota",
      },
    ],
  };
}

module.exports = {
  scoreOrder,
};
