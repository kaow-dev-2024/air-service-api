'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(queryInterface, 'roles',
      [
        {
          "role_id": 1,
          "name": "admin",
          "remark": "System administrator with full access",
          "is_active": true
        },
        {
          "role_id": 2,
          "name": "staff-airport",
          "remark": "Airport operational staff",
          "is_active": true
        },
        {
          "role_id": 3,
          "name": "staff-airline",
          "remark": "Airline operational staff",
          "is_active": true
        }
      ],
      ["role_id"]);
    await resetSequence(queryInterface, "roles", "role_id");

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
