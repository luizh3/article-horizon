"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleAppraiser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ArticleAppraiser.hasOne(models.User, {
        foreignKey: "id_user",
        sourceKey: "id_appraiser",
      });
    }
  }
  ArticleAppraiser.init(
    {
      id_article_appraiser: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_article: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_appraiser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nr_relevant_score: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 0.0,
      },
      nr_experience_score: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 0.0,
      },
      fg_rated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ArticleAppraiser",
      tableName: "article_appraiser",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return ArticleAppraiser;
};
