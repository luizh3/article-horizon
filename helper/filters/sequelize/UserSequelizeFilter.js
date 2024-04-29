const sequelize = require("sequelize");

const SequelizeFilterHelper = require("./SequelizeFilterHelper");

function searchNameAndUserType(search, typeUser) {
  const hasSearch = search !== "" && search !== undefined;
  const hasTypeUser = typeUser !== undefined && typeUser !== -1;

  if (!hasSearch && !hasTypeUser) {
    return {};
  }

  var query = {
    where: {},
  };

  if (hasTypeUser) {
    query = {
      ...query,
      where: {
        ...query.where,
        tp_user: typeUser,
      },
    };
  }

  if (hasSearch) {
    query = {
      ...query,
      where: {
        ...query.where,
        [sequelize.Op.and]: SequelizeFilterHelper.likeLowerCase(
          search,
          "ds_name"
        ),
      },
    };
  }

  return query;
}

module.exports = {
  searchNameAndUserType,
};
