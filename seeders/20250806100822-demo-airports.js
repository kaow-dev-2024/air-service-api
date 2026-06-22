"use strict";

const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tz = process.env.TIME_ZONE || "Asia/Bangkok";
    const rows = [
      {
        airport_id: 1,
        name: "Luang Prabang International Airport",
        iata_code: "LPQ",
        icao_code: "VLLB",
        city: "Luang Prabang",
        country: "Laos",
        timezone: tz,
        remark: "UAT LPQ primary airport",
        is_active: true,
      },
      {
        airport_id: 2,
        name: "Wattay International Airport",
        iata_code: "VTE",
        icao_code: "VLVT",
        city: "Vientiane",
        country: "Laos",
        timezone: tz,
        remark: "UAT route pair with LPQ",
        is_active: true,
      },
      {
        airport_id: 3,
        name: "Don Mueang International Airport",
        iata_code: "DMK",
        icao_code: "VTBD",
        city: "Bangkok",
        country: "Thailand",
        timezone: tz,
        remark: "UAT route pair with LPQ",
        is_active: true,
      },
      {
        airport_id: 4,
        name: "Suvarnabhumi Airport",
        iata_code: "BKK",
        icao_code: "VTBS",
        city: "Bangkok",
        country: "Thailand",
        timezone: tz,
        remark: "UAT route pair with LPQ",
        is_active: true,
      },
      {
        airport_id: 5,
        name: "Chiang Mai International Airport",
        iata_code: "CNX",
        icao_code: "VTCC",
        city: "Chiang Mai",
        country: "Thailand",
        timezone: tz,
        remark: "UAT optional route",
        is_active: true,
      },
      {
        airport_id: 6,
        name: "Noi Bai International Airport",
        iata_code: "HAN",
        icao_code: "VVNB",
        city: "Hanoi",
        country: "Vietnam",
        timezone: tz,
        remark: "UAT optional route",
        is_active: true,
      },
      {
        airport_id: 7,
        name: "Kunming Changshui International Airport",
        iata_code: "KMG",
        icao_code: "ZPPP",
        city: "Kunming",
        country: "China",
        timezone: tz,
        remark: "UAT optional route",
        is_active: true,
      },
      {
        airport_id: 8,
        name: "Pakse International Airport",
        iata_code: "PKZ",
        icao_code: "VLPS",
        city: "Pakse",
        country: "Laos",
        timezone: tz,
        remark: "UAT optional route",
        is_active: true,
      },
      {
        airport_id: 9,
        name: "Siem Reap Angkor International Airport",
        iata_code: "SAI",
        icao_code: "VDSA",
        city: "Siem Reap",
        country: "Cambodia",
        timezone: tz,
        remark: "UAT optional route",
        is_active: true,
      },
    ];

    await upsertSeedRows(queryInterface, "airports", rows, ["airport_id"]);
    await resetSequence(queryInterface, "airports", "airport_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("airports", null, {});
  },
};
