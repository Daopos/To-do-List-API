"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      files: {
        type: Sequelize.STRING,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      priority: {
        type: Sequelize.ENUM("All", "Low", "High", "Critical"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "In Progress",
          "Not Started",
          "Complete",
          "Cancelled"
        ),
      },
      completed_date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
