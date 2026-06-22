module.exports = (sequelize, DataTypes) => {
  const Belt = sequelize.define(
    "Belt",
    {
      belt_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      tableName: 'belts'
    }
  );

  return Belt;
};
