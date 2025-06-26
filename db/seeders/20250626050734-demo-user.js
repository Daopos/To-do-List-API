"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "hashed_password_1", // Ideally hash your passwords
          provider: null,
          provider_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Smith",
          username: "janesmith",
          email: "jane@example.com",
          password: "hashed_password_2",
          provider: null,
          provider_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
