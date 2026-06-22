module.exports = (sequelize, DataTypes) => {
  const Airline = sequelize.define(
    "Airline",
    {
      airline_id: {
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
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      checkin_open_inter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 180, // in minutes
      },
      checkin_close_inter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60, // in minutes
      },
      boarding_time_inter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30, // in minutes
      },
      first_bag_inter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15, // in minutes
      },
      last_bag_inter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30, // in minutes
      },
      checkin_open_dom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 120, // in minutes
      },
      checkin_close_dom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 45, // in minutes
      },
      boarding_time_dom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20, // in minutes
      },
      first_bag_dom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15, // in minutes
      },
      last_bag_dom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30, // in minutes
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
      tableName: 'airlines'
    }
  );

  return Airline;
};
