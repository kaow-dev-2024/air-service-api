module.exports = (sequelize, DataTypes) => {
  const SeasonFlight = sequelize.define(
    "SeasonFlight",
    {
      season_flight_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      origin_airport_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "airports",
          key: "airport_id",
        },
      },
      destination_airport_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "airports",
          key: "airport_id",
        },
      },
      airline_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "airlines",
          key: "airline_id",
        },
      },
      aircraft_type_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "aircraft_types",
          key: "aircraft_type_id",
        },
      },
      direction_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "directions",
          key: "direction_id",
        },
      },
      flight_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "flight_categories",
          key: "flight_category_id",
        },
      },
      terminal_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "terminals",
          key: "terminal_id",
        },
      },
      belt_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "belts",
          key: "belt_id",
        },
      },
      gate_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "gates",
          key: "gate_id",
        },
      },
      counters: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
      },
      flight_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valid_from: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      valid_to: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      std: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      sta: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      operation_days: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
      },
      is_import: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: 'season_flights',
    }
  );

  return SeasonFlight;
};
