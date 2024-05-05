const expressHandlebars = require("express-handlebars");

const {
  MAIN_LAYOUT_NAME,
} = require("@root/helper/constants/handlebarsConstants");

exports.init = function (app) {
  app.engine(
    "handlebars",
    expressHandlebars.engine({
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
        isEmpty: function (array) {
          return array.length === 0;
        },
        and: function (first, second) {
          return first && second;
        },
        or: function (first, second) {
          return first || second;
        },
        isInclude: function (value, array) {
          return array.includes(value);
        },
      },
    })
  );

  app.set("view engine", "handlebars");
};
