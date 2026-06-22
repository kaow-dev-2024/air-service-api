module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define(
    "Airport",
    {
      airport_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
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
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING,
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
      tableName: 'airports'
    }
  );

  return Airport;
};
