const UserTypeEnum = {
  UNKNOW: -1,
  ADMIN: 1,
  AUTOR: 2,
  AVALIADOR: 3,

  toString: function enumToString(type) {
    const options = {
      1: "Administrador",
      2: "Autor",
      3: "Avaliador",
    };

    return options[type] ?? "Desconhecido";
  },
};

module.exports = UserTypeEnum;
