const UserTypeEnum = require("../enums/UserTypeEnum");

function userTypes() {
  return [
    {
      id: UserTypeEnum.ADMIN,
      description: UserTypeEnum.toString(UserTypeEnum.ADMIN),
      selected: false,
    },
    {
      id: UserTypeEnum.AUTOR,
      description: UserTypeEnum.toString(UserTypeEnum.AUTOR),
      selected: false,
    },
    {
      id: UserTypeEnum.AVALIADOR,
      description: UserTypeEnum.toString(UserTypeEnum.AVALIADOR),
      selected: false,
    },
  ];
}

function userTypesSelected(idType) {
  return userTypes().map((current) => {
    if (current.id === idType) {
      return { ...current, selected: true };
    }
    return current;
  });
}

module.exports = {
  userTypes,
  userTypesSelected,
};
