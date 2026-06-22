"use strict";

const bcryptjs = require("bcryptjs");
const { resetSequence, upsertSeedRows } = require("../scripts/reset-sequence");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const salt = await bcryptjs.genSalt(10);

    const passwordHashPai = await bcryptjs.hash("paiadmin@passwd", salt);
    const passwordHashCnx = await bcryptjs.hash("cnx@passwd", salt);

    await upsertSeedRows(
      queryInterface,
      "users",
      [
        {
          role_id: 1,
          airline_id: null,
          username: "paiadmin",
          password: passwordHashPai,
          full_name: "pai",
          email: "paiadmin@admin.com",
          phone: "0000000000",
          last_login: null,
          remark: "pai",
          is_active: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          role_id: 1,
          airline_id: null,
          username: "cnx",
          password: passwordHashCnx,
          full_name: "pai",
          email: "cnx@admin.com",
          phone: "0000000000",
          last_login: null,
          remark: "cnx",
          is_active: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      ["username"],
      [
        "role_id",
        "airline_id",
        "password",
        "full_name",
        "email",
        "phone",
        "last_login",
        "remark",
        "is_active",
        "updatedAt",
      ]
    );
    await resetSequence(queryInterface, "users", "user_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      username: ["paiadmin", "cnx"],
    });
  },
};
