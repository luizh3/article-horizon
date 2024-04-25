"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArticleAuthor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ArticleAuthor.hasOne(models.User, {
        foreignKey: "id_user",
        sourceKey: "id_author",
      });
    }
  }
  ArticleAuthor.init(
    {
      id_article: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      id_author: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ArticleAuthor",
      tableName: "article_author",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ArticleAuthor;
};
