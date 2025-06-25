"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add altering commands here.
    //   Example:
    await queryInterface.addColumn("tasks", "details", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Add reverting commands here.

    //   Example:
    await queryInterface.removeColumn("tasks", "details", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
