const handlebars = require("express-handlebars");

const { MAIN_LAYOUT_NAME } = require("../helper/constants/handlebarsConstants");

exports.init = function (app) {
  app.engine(
    "handlebars",
    handlebars.engine({
      defaultLayout: MAIN_LAYOUT_NAME,
      helpers: {
        isDefined: function (value) {
          return value !== undefined;
        },
        isBiggerOrEqual: function (first, second) {
          return parseInt(first) >= parseInt(second);
        },
        isEqual: function (first, second) {
          return first === second;
        },
        multiplication: function (first, second) {
          return (parseFloat(first) * parseFloat(second)).toFixed(2);
        },
      },
    })
  );

  app.set("view engine", "handlebars");
};
