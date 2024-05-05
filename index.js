require("module-alias/register");

const express = require("express");
const routes = require("./routes/Router");
const path = require("path");

const { init: initHandlebars } = require("./config/handlebars");
const { init: initSession } = require("./config/session");

const { properties } = require("./middlewares/PropertiesDefaultMiddleware");

var app = express();

initHandlebars(app);
initSession(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(properties);
app.use(routes);

app.use(express.static(path.join(__dirname, "public")));

const PORT = 8082;

app.listen(PORT, function () {
  console.log(`Servidor no http://localhost:${PORT}`);
});
