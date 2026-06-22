module.exports = (sequelize, DataTypes) => {
  const FlightStatus = sequelize.define(
    "FlightStatus",
    {
      flight_status_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      is_arrival: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_departure: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: 'flight_status'
    }
  );

  return FlightStatus;
};
