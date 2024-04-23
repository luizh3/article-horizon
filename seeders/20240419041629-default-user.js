"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("user", [
      {
        ds_name: "admin",
        ds_email: "admin@admin.com.br",
        ds_username: "admin",
        ds_password: "123",
        tp_user: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("user", null, {});
  },
};
