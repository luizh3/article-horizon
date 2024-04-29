"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("article_appraiser", {
      id_article: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      id_appraiser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nr_relevant_score: {
        type: Sequelize.DECIMAL(4, 2),
        defaultValue: 0.0,
      },
      nr_experience_score: {
        type: Sequelize.DECIMAL(4, 2),
        defaultValue: 0.0,
      },
      nr_final_score: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      fg_rated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("article_appraiser");
  },
};
