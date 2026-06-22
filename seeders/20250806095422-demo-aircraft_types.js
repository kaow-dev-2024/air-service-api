'use strict';

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await upsertSeedRows(queryInterface, 'aircraft_types', [
      {
        "iata_code": "ATR42",
        "icao_code": "AT42",
        "manufacturer": "ATR",
        "model": "ATR 42",
        "category": "turboprop",
        "seat_capacity": 50,
        "range_km": 1500,
        "remark": "Used on domestic and Bangkok routes",
        "is_active": true
      },
      {
        "iata_code": "ATR72",
        "icao_code": "AT72",
        "manufacturer": "ATR",
        "model": "ATR 72",
        "category": "turboprop",
        "seat_capacity": 70,
        "range_km": 1600,
        "remark": "Most common aircraft at LPQ",
        "is_active": true
      },
      {
        "iata_code": "A320",
        "icao_code": "A320",
        "manufacturer": "Airbus",
        "model": "A31X/A32X",
        "category": "jet airliner",
        "seat_capacity": 150,
        "range_km": 6100,
        "remark": "Used by Thai/Laos carriers on Bangkok and international routes",
        "is_active": true
      },
      {
        "iata_code": "MA600",
        "icao_code": "MA6",
        "manufacturer": "Xian Aircraft",
        "model": "MA-600/60",
        "category": "turboprop",
        "seat_capacity": 60,
        "range_km": 1800,
        "remark": "Seasonal or less frequent aircraft type",
        "is_active": true
      },
      {
        "iata_code": "B737",
        "icao_code": "B737",
        "manufacturer": "Boeing",
        "model": "737",
        "category": "jet airliner",
        "seat_capacity": 160,
        "range_km": 5600,
        "remark": "Occasional service",
        "is_active": true
      },
      {
        "iata_code": "A321",
        "icao_code": "A321",
        "manufacturer": "Airbus",
        "model": "A321-100/200",
        "category": "jet airliner",
        "seat_capacity": 185,
        "range_km": 7400,
        "remark": "Used on Siem Reap international route",
        "is_active": true
      }
    ], ["iata_code"]);
    await resetSequence(queryInterface, "aircraft_types", "aircraft_type_id");

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('aircraft_types', null, {});

  }
};
