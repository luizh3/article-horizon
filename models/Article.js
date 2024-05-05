"use strict";

const { Model } = require("sequelize");
const ArticleStatusEnum = require("@root/enums/ArticleStatusEnum");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init(
    {
      id_article: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ds_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ds_summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link_pdf: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tp_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: ArticleStatusEnum.PENDENTE,
      },
      nr_score: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      id_creator_author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: null,
      },
      dh_created: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "article",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Article;
};
