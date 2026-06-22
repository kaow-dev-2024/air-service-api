'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(
      queryInterface,
      "belts",
      [
        {
          "belt_id": 1,
          "name": "1",
          "remark": "Main belt for arrivals",
          "is_active": true},
        {
          "belt_id": 2,
          "name": "2",
          "remark": "Secondary belt for arrivals",
          "is_active": true},
        {
          "belt_id": 3,
          "name": "3",
          "remark": "Belt for oversized luggage",
          "is_active": true},
        {
          "belt_id": 4,
          "name": "4",
          "remark": "Belt for international flights",
          "is_active": true},
        {
          "belt_id": 5,
          "name": "5",
          "remark": "Belt for VIP passengers",
          "is_active": true}],
      ["belt_id"],
    );
    await resetSequence(queryInterface, "belts", "belt_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('belts', null, {});
  }};
