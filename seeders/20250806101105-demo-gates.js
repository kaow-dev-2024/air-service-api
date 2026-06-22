'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(
      queryInterface,
      "gates",
      [
        {
          "gate_id": 1,
          "name": "1",
          "remark": "Main gate for arrivals",
          "is_active": true},
        {
          "gate_id": 2,
          "name": "2",
          "remark": "Outgoing flights",
          "is_active": true},
        {
          "gate_id": 3,
          "name": "3",
          "remark": "Domestic flights",
          "is_active": true},
        {
          "gate_id": 4,
          "name": "4",
          "remark": "International flights",
          "is_active": true},
        {
          "gate_id": 5,
          "name": "5",
          "remark": "VIP flights",
          "is_active": true}],
      ["gate_id"],
    );
    await resetSequence(queryInterface, "gates", "gate_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gates', null, {});
  }};
