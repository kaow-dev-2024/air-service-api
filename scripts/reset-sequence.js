"use strict";

const upsertSeedRows = async (
  queryInterface,
  tableName,
  rows,
  conflictFields,
  updateFields
) => {
  if (!rows.length) return;

  const updateOnDuplicate =
    updateFields ||
    Object.keys(rows[0]).filter((column) => !conflictFields.includes(column));

  await queryInterface.bulkInsert(tableName, rows, {
    updateOnDuplicate,
    upsertKeys: conflictFields,
  });
};

const resetSequence = async (queryInterface, tableName, idColumn) => {
  const quotedTableName = queryInterface.quoteIdentifier(tableName);
  const quotedIdColumn = queryInterface.quoteIdentifier(idColumn);

  await queryInterface.sequelize.query(
    `
    SELECT setval(
      pg_get_serial_sequence(:tableName, :idColumn),
      COALESCE((SELECT MAX(${quotedIdColumn}) FROM ${quotedTableName}), 0) + 1,
      false
    );
    `,
    {
      replacements: {
        tableName,
        idColumn,
      },
    }
  );
};

module.exports = {
  resetSequence,
  upsertSeedRows,
};
