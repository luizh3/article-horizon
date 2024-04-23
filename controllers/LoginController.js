const { User } = require("../models");

async function onLogin(user) {
  const userDatabase = await User.findOne({
    where: { ds_email: user.email },
  })
    .then((user) => {
      return user;
    })
    .catch((error) => {
      console.error(error);
    });

  return {
    hasEmail: userDatabase !== null,
    hasPassword:
      userDatabase !== null && user.password === userDatabase.ds_password,
    user: userDatabase,
  };
}

module.exports = {
  onLogin,
};
