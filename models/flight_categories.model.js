module.exports = (sequelize, DataTypes) => {
  const FlightCategory = sequelize.define(
    "FlightCategory",
    {
      flight_category_id: {
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
      tableName: 'flight_categories'
    }
  );

  return FlightCategory;
};
