const { v4: uuidv4 } = require("uuid");
const session = require("express-session");

module.exports = {
  init: (app) => {
    app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          maxAge: 3600000,
        },
        genid: function (req) {
          return uuidv4();
        },
      })
    );
  },
};
