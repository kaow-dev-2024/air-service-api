'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(
      queryInterface,
      "terminals",
      [
        {
          "terminal_id": 1,
          "name": "1",
          "remark": "Main terminal for domestic flights",
          "is_active": true},
        {
          "terminal_id": 2,
          "name": "2",
          "remark": "Terminal for international flights",
          "is_active": true}],
      ["terminal_id"],
    );
    await resetSequence(queryInterface, "terminals", "terminal_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('terminals', null, {});
  }};
