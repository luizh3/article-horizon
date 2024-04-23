module.exports = {
  format: (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    var dateFormat = date.toLocaleDateString("pt-BR", options);

    return dateFormat.charAt(0).toUpperCase() + dateFormat.substring(1);
  },
};
