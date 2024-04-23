function statusToString(type) {
  const options = {
    1: "Revisão",
    2: "Aceito",
    3: "Rejeitado",
  };

  return options[type] ?? "Não informado";
}

module.exports = {
  statusToString,
};
