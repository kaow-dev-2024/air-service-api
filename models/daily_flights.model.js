module.exports = (sequelize, DataTypes) => {
  const DailyFlight = sequelize.define(
    "DailyFlight",
    {
      daily_flight_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      season_flight_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "season_flights",
          key: "season_flight_id",
        },
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
      flight_status_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "flight_status",
          key: "flight_status_id",
        },
      },
      flight_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flight_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sta: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      std: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      eta: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      etd: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      ata: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      atd: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      checkin_open: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      checkin_close: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      boarding_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      first_bag: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      last_bag: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      operation_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_code_share: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      force: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      code_shares: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      is_all_flight_checkin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: 'daily_flights',
    }
  );

  return DailyFlight;
};
