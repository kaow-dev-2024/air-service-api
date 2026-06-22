"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "daily_flights";
    const columnName = "force";
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName,
    );

    // Fresh databases may not have the table yet because the app creates it at startup.
    if (!normalizedTables.includes(tableName)) {
      return;
    }

    const tableDefinition = await queryInterface.describeTable(tableName);

    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn(tableName, columnName, {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface) {
    const tableName = "daily_flights";
    const columnName = "force";
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName,
    );

    if (!normalizedTables.includes(tableName)) {
      return;
    }

    const tableDefinition = await queryInterface.describeTable(tableName);

    if (tableDefinition[columnName]) {
      await queryInterface.removeColumn(tableName, columnName);
    }
  },
};
