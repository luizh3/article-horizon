const { User } = require("../models");
const sequelize = require("sequelize");

async function onLogin(user) {
  const userDatabase = await User.findOne({
    where: {
      [sequelize.Op.or]: {
        ds_username: user.identifier,
        ds_email: user.identifier,
      },
    },
  })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.error(error);
    });

  return {
    hasIdentifier: userDatabase !== null,
    hasPassword:
      userDatabase !== null && user.password === userDatabase.ds_password,
    user: userDatabase,
  };
}

module.exports = {
  onLogin,
};
