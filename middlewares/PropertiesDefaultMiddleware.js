const UserTypeEnum = require("../enums/UserTypeEnum");

function UserOption(userType) {
  if (userType !== UserTypeEnum.ADMIN) {
    return {};
  }

  return {
    title: "Usuario",
    menus: [
      {
        title: "Criar",
        href: "/user/create",
      },
      {
        title: "Listar",
        href: "/user/list",
      },
    ],
  };
}

function ArticleOption(userType) {
  const createElement = {
    title: "Criar",
    href: "/article/create",
  };

  const listElement = {
    title: "Listar",
    href: "/article/list",
  };

  var option = {
    title: "Artigos",
    menus: [listElement],
  };

  if (userType === UserTypeEnum.AUTOR) {
    option = { ...option, menus: { ...option.menus, createElement } };
  }

  return option;
}

function headerOptions(userType) {
  return [ArticleOption(userType), UserOption(userType)];
}

function userSession(session) {
  const id = session?.user?.id;
  const type = session?.user?.type;
  const name = session?.user?.name;

  return {
    id,
    name,
    descricaoTipoUsuario: UserTypeEnum.toString(type),
    isAdmin: UserTypeEnum.ADMIN === type,
    isAuthor: UserTypeEnum.AUTOR === type,
    isAppraise: UserTypeEnum.AVALIADOR === type,
  };
}

module.exports = {
  properties: (req, res, next) => {
    const userType = req.session?.user?.type;

    res.locals = {
      headerOptions: headerOptions(userType),
      userSession: userSession(req.session),
    };

    next();
  },
};
