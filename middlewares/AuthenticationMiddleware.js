const UserTypeEnum = require("../enums/UserTypeEnum");

function isAuthenticated() {
  return (req, res, next) => {
    const typeUserSession = req.session?.user?.type;

    const hasUserSession =
      typeUserSession !== null && typeUserSession !== undefined;

    if (!hasUserSession) {
      res.render("pages/AccessDenied", {
        layout: "main-clean",
      });
      return;
    }

    next();
  };
}

function checkRole(typeUsersPermited, isJson) {
  return (req, res, next) => {
    const typeUserSession = req.session?.user?.type;

    const hasUserSession =
      typeUserSession !== null && typeUserSession !== undefined;

    const hasPermission =
      hasUserSession && typeUsersPermited.includes(typeUserSession);

    if (!hasPermission && isJson) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!hasPermission) {
      res.render("pages/AccessDenied", {
        layout: "main-clean",
      });
      return;
    }

    next();
  };
}

module.exports = {
  checkRole,
  isAuthenticated,
};
