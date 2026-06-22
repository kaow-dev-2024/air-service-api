'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(queryInterface, 'flight_categories',
      [
        {
          "flight_category_id": 1,
          "name": "Domestic",
          "remark": "ภายในประเทศ",
          "is_active": true
        },
        {
          "flight_category_id": 2,
          "name": "International",
          "remark": "ระหว่างประเทศ",
          "is_active": true
        }
      ],
      ["flight_category_id"]);
    await resetSequence(queryInterface, "flight_categories", "flight_category_id");

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('flight_categories', null, {});
  }
};
