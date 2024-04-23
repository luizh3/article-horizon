"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("article", {
      id_article: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ds_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ds_summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      link_pdf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tp_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dh_created: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("article");
  },
};
