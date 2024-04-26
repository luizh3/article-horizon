module.exports = {
  only: {
    number: {
      range: {
        decimal: (max, decimals = 2) => {
          return `^${max}(\\.0{1,${decimals}})?$|^[0-9](\\.\\d{1,${decimals}})?$`;
        },
      },
    },
  },
};
