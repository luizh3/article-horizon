const sequelize = require("sequelize");

function likeLowerCase(dsSearch, dsColumn) {
  return [
    sequelize.where(sequelize.fn("LOWER", sequelize.col(dsColumn)), {
      [sequelize.Op.like]: "%" + dsSearch.toLowerCase() + "%",
    }),
  ];
}

module.exports = {
  likeLowerCase,
};
