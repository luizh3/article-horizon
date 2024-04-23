function enumToString(type) {
  const options = {
    1: "Administrador",
    2: "Autor",
    3: "Avaliador",
  };

  return options[type] ?? "Desconhecido";
}

function userTypes() {
  return [
    {
      id: 1,
      description: "Administrador",
      selected: false,
    },
    {
      id: 2,
      description: "Autor",
      selected: false,
    },
    {
      id: 3,
      description: "Avaliador",
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
  enumToString,
  userTypes,
  userTypesSelected,
};
