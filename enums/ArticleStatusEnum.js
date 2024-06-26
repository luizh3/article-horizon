const ArticleStatusEnum = {
  UNKNOW: -1,
  REVISAO: 1,
  ACEITO: 2,
  REJEITADO: 3,
  PENDENTE: 4,
  AVALIACAO: 5,

  toString: (type) => {
    const options = {
      1: "Revisão",
      2: "Aceito",
      3: "Rejeitado",
      4: "Pendente",
      5: "Avaliação",
    };

    return options[type] ?? "Não informado";
  },
};

module.exports = ArticleStatusEnum;
