const sequelize = require("sequelize");

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
        ds_name: {
          [sequelize.Op.like]: `%${search}%`,
        },
      },
    };
  }

  return query;
}

module.exports = {
  searchNameAndUserType,
};
