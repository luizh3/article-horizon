"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ds_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ds_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ds_username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ds_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tp_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
