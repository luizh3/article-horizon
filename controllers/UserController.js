const { Op } = require("sequelize");
const { User } = require("../models");
const { use } = require("../routes/ArticleRouter");

const UserHelper = require("../helper/UserHelper");

async function hasUserRegister(user) {
  return await User.findOne({
    where: {
      [Op.or]: {
        ds_username: user.username,
        ds_email: user.email,
      },
    },
  })
    .then((result) => {
      return {
        hasEmail: result !== null && result.ds_email === user.email,
        hasUsername: result !== null && result.ds_username === user.username,
      };
    })
    .catch((error) => console.error(error));
}

async function insert(user) {
  return await User.create({
    ds_username: user.username,
    ds_password: user.password,
    tp_user: parseInt(user.type),
    ds_name: user.name,
    ds_email: user.email,
  });
}

async function findAll() {
  return await User.findAll()
    .then((users) => {
      return users.map((current) => {
        return {
          id: current.id_user,
          name: current.ds_name,
          email: current.ds_email,
          type: UserHelper.enumToString(current.tp_user),
        };
      });
    })
    .catch((error) => console.error(error));
}

async function removeById(id) {
  await User.destroy({
    where: {
      id_user: id,
    },
  });
}

async function findById(id) {
  return await User.findByPk(id).then((current) => {
    console.log(current);
    if (current === null) {
      return null;
    }

    return {
      id: current.id_user,
      username: current.ds_username,
      name: current.ds_name,
      type: current.tp_user,
      email: current.ds_email,
    };
  });
}

async function updateById(user) {
  await User.update(
    {
      ds_username: user.username,
      ds_password: user.password,
      tp_user: parseInt(user.type),
      ds_name: user.name,
      ds_email: user.email,
    },
    {
      where: {
        id_user: user.id,
      },
    }
  );
}

module.exports = {
  hasUserRegister,
  insert,
  findAll,
  removeById,
  findById,
  updateById,
};
