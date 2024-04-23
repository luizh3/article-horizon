"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ds_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ds_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ds_username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ds_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tp_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return User;
};
