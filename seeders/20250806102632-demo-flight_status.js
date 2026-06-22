'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(
      queryInterface,
      "flight_status",
      [
        {
          "flight_status_id": 1,
          "name": "Scheduled",
          "remark": "Flight is scheduled",
          "is_departure": true,
          "is_arrival": true,
          "is_active": true},
        {
          "flight_status_id": 2,
          "name": "Check-in",
          "remark": "Check-in is open",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 3,
          "name": "Boarding",
          "remark": "Boarding started",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 4,
          "name": "Gate Open",
          "remark": "Gate is open for boarding",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 5,
          "name": "Gate Closing",
          "remark": "Gate closing soon",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 6,
          "name": "Departed",
          "remark": "Flight has departed",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 7,
          "name": "Arrived",
          "remark": "Flight has arrived",
          "is_departure": false,
          "is_arrival": true,
          "is_active": true},
        {
          "flight_status_id": 8,
          "name": "Delayed",
          "remark": "Flight is delayed",
          "is_departure": true,
          "is_arrival": true,
          "is_active": true},
        {
          "flight_status_id": 9,
          "name": "Cancelled",
          "remark": "Flight has been cancelled",
          "is_departure": true,
          "is_arrival": true,
          "is_active": true},
        {
          "flight_status_id": 10,
          "name": "Final Call",
          "remark": "Final call for boarding",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 11,
          "name": "Last Call",
          "remark": "Last call for boarding",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 12,
          "name": "Gate Change",
          "remark": "Gate has changed",
          "is_departure": true,
          "is_arrival": true,
          "is_active": true},
        {
          "flight_status_id": 13,
          "name": "Check-in Closed",
          "remark": "Check-in Closed",
          "is_departure": true,
          "is_arrival": false,
          "is_active": true},
        {
          "flight_status_id": 14,
          "name": "Take off",
          "remark": "Take off",
          "is_departure": false,
          "is_arrival": true,
          "is_active": true}],
      ["flight_status_id"],
    );
    await resetSequence(queryInterface, "flight_status", "flight_status_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('flight_status', null, {});
  }};
