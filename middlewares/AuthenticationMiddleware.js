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
  authentication: (req, res, next) => {
    console.log(
      `Middleware Authentication [URL] ${req.url} [SESSION] ${req.session}`
    );

    const permissionByTypeUser = {
      admin: ["/user/create", "/user/update", "/user/delete", "/user/list"],
      author: ["/article/create", "/article/delete"],
      commons: ["/article/list", "/logout", `/article/autor/:name`],
      public: [
        "/login",
        "/home",
        "/css/output.css",
        "/",
        "/images/designer.jpeg",
        "/images/logo.png", // TODO ajustar isso
      ],
    };

    console.log(permissionByTypeUser["commons"]);

    if (permissionByTypeUser["public"].includes(req.url)) {
      next();
      return;
    }

    if (req.session.user) {
      const typeUser = req.session?.user?.type;

      if (typeUser === undefined || typeUser === null) {
        res.redirect("/login");
        return;
      }

      if (permissionByTypeUser["commons"].includes(req.url)) {
        next();
        return;
      }

      const roleByDescription = new Map([
        [UserTypeEnum.ADMIN, "admin"],
        [UserTypeEnum.AUTOR, "author"],
      ]);

      if (
        permissionByTypeUser[roleByDescription.get(typeUser)].includes(req.url)
      ) {
        next();
        return;
      }

      res.render("pages/AccessDenied", {
        layout: "main-clean",
      });
      return;
    }

    console.error(
      `Error ao redirecionar a [URL] ${req.url}, indo para o Login`
    );

    res.redirect("/login");
  },
};
