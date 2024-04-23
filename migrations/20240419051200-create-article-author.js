"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("article_author", {
      id_article: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_author: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("article_author");
  },
};
