module.exports = (sequelize, DataTypes) => {
  const AircraftType = sequelize.define(
    "AircraftType",
    {
      aircraft_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      iata_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      icao_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      model: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      seat_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      range_km: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: 'aircraft_types'
    }
  );

  return AircraftType;
};
