'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(queryInterface, 'directions',
      [
        {
          "direction_id": 1,
          "name": "Arrival",
          "remark": "Incoming flights",
          "is_active": true
        },
        {
          "direction_id": 2,
          "name": "Departure",
          "remark": "Outgoing flights",
          "is_active": true
        }
      ],
      ["direction_id"]);
    await resetSequence(queryInterface, "directions", "direction_id");

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('directions', null, {});
  }
};
