'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await upsertSeedRows(
      queryInterface,
      "counters",
      [
        {
          "counter_id": 1,
          "name": "1",
          "remark": "Check-in - International",
          "is_active": true},
        {
          "counter_id": 2,
          "name": "2",
          "remark": "Check-in - International",
          "is_active": true},
        {
          "counter_id": 3,
          "name": "3",
          "remark": "Check-in - Domestic",
          "is_active": true},
        {
          "counter_id": 4,
          "name": "4",
          "remark": "Check-in - Domestic",
          "is_active": true},
        { counter_id: 5, name: "5", remark: "Group Check-in", is_active: true },
        {
          "counter_id": 6,
          "name": "6",
          "remark": "Online Check-in Bag Drop",
          "is_active": true},
        {
          "counter_id": 7,
          "name": "7",
          "remark": "Oversize Baggage",
          "is_active": true},
        {
          "counter_id": 8,
          "name": "8",
          "remark": "Priority Check-in",
          "is_active": true},
        { counter_id: 9, name: "9", remark: "Staff Use Only", is_active: true },
        {
          "counter_id": 10,
          "name": "10",
          "remark": "Information Desk",
          "is_active": true},
        {
          "counter_id": 11,
          "name": "11",
          "remark": "Visa on Arrival",
          "is_active": true},
        {
          "counter_id": 12,
          "name": "12",
          "remark": "Lost & Found",
          "is_active": false},
        {
          "counter_id": 13,
          "name": "13",
          "remark": "Customer Service",
          "is_active": false},
        {
          "counter_id": 14,
          "name": "14",
          "remark": "Medical Assistance",
          "is_active": false},
        {
          "counter_id": 15,
          "name": "15",
          "remark": "Airline Support",
          "is_active": false},
        {
          "counter_id": 16,
          "name": "16",
          "remark": "Upgrade/Change Seat",
          "is_active": false},
        {
          "counter_id": 17,
          "name": "17",
          "remark": "Security Assistance",
          "is_active": false},
        {
          "counter_id": 18,
          "name": "18",
          "remark": "Travel Insurance",
          "is_active": false},
        {
          "counter_id": 19,
          "name": "19",
          "remark": "Emergency Counter",
          "is_active": false},
        {
          "counter_id": 20,
          "name": "20",
          "remark": "Travel Document Check",
          "is_active": false},
        {
          "counter_id": 21,
          "name": "21",
          "remark": "Immigration Help",
          "is_active": false},
        {
          "counter_id": 22,
          "name": "22",
          "remark": "Tour Group Desk",
          "is_active": false},
        {
          "counter_id": 23,
          "name": "23",
          "remark": "Baggage Inquiry",
          "is_active": false},
        {
          "counter_id": 24,
          "name": "24",
          "remark": "Express Check-in",
          "is_active": false},
        {
          "counter_id": 25,
          "name": "25",
          "remark": "Late Check-in",
          "is_active": false},
        {
          "counter_id": 26,
          "name": "26",
          "remark": "Check-in Kiosk Assistance",
          "is_active": false},
        {
          "counter_id": 27,
          "name": "27",
          "remark": "Flight Delay Help",
          "is_active": false},
        {
          "counter_id": 28,
          "name": "28",
          "remark": "Rebooking Counter",
          "is_active": false},
        {
          "counter_id": 29,
          "name": "29",
          "remark": "Airline Lounge Check",
          "is_active": false},
        {
          "counter_id": 30,
          "name": "30",
          "remark": "Ticket Sales",
          "is_active": false}],
      ["counter_id"],
    );
    await resetSequence(queryInterface, "counters", "counter_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('counters', null, {});
  }};
