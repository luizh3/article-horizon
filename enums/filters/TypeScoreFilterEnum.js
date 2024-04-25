const TypeScoreFilterEnum = {
  UNKNOW: -1,
  DESC: 1,
  ASC: 2,

  toString: function toString(type) {
    return {
      1: "DESC",
      2: "ASC",
    }[type];
  },
};

module.exports = TypeScoreFilterEnum;
