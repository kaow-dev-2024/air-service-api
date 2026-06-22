const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);
  return date.format("YYYY-MM-DD HH:mm:ss.SSS");
};

const env = process.env.NODE_ENV || "production";
const config = require("../config/config")[env];

const UsersModel = require("./users.model");
const RolesModel = require("./roles.model");
const AirlinesModel = require("./airlines.model");
const AirportsModel = require("./airports.model");
const BeltsModel = require("./belts.model");
const GatesModel = require("./gates.model");
const DirectionsModel = require("./directions.model");
const AircraftTypesModel = require("./aircraft_types.model");
const FlightCategoriesModel = require("./flight_categories.model");
const TerminalsModel = require("./terminals.model");
const CountersModel = require("./counters.model");
const FlightStatusModel = require("./flight_status.model");
const SeasonFlightsModel = require("./season_flights.model");
const DailyFlightsModel = require("./daily_flights.model");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    dialectOptions: config.dialectOptions,
    logging: false, // Disable logging; default: console.log
  },
);

// Initialize models
const User = UsersModel(sequelize, Sequelize);
const Role = RolesModel(sequelize, Sequelize);
const Airline = AirlinesModel(sequelize, Sequelize);
const Airport = AirportsModel(sequelize, Sequelize);
const Belt = BeltsModel(sequelize, Sequelize);
const Gate = GatesModel(sequelize, Sequelize);
const Direction = DirectionsModel(sequelize, Sequelize);
const AircraftType = AircraftTypesModel(sequelize, Sequelize);
const FlightCategory = FlightCategoriesModel(sequelize, Sequelize);
const Terminal = TerminalsModel(sequelize, Sequelize);
const Counter = CountersModel(sequelize, Sequelize);
const FlightStatus = FlightStatusModel(sequelize, Sequelize);
const SeasonFlight = SeasonFlightsModel(sequelize, Sequelize);
const DailyFlight = DailyFlightsModel(sequelize, Sequelize);

//User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });
Airline.hasMany(User, { foreignKey: "airline_id" });
User.belongsTo(Airline, { foreignKey: "airline_id" });
// Airline
Airline.hasMany(SeasonFlight, { foreignKey: "airline_id" });
SeasonFlight.belongsTo(Airline, { foreignKey: "airline_id" });
Airline.hasMany(DailyFlight, { foreignKey: "airline_id" });
DailyFlight.belongsTo(Airline, { foreignKey: "airline_id" });
// Airport.js
Airport.hasMany(SeasonFlight, {
  foreignKey: "origin_airport_id",
  as: "OriginFlightsSeason",
});
Airport.hasMany(SeasonFlight, {
  foreignKey: "destination_airport_id",
  as: "DestinationFlightsSeason",
});
SeasonFlight.belongsTo(Airport, {
  foreignKey: "origin_airport_id",
  as: "Origin",
});
SeasonFlight.belongsTo(Airport, {
  foreignKey: "destination_airport_id",
  as: "Destination",
});

Airport.hasMany(DailyFlight, {
  foreignKey: "origin_airport_id",
  as: "OriginFlightssDaily",
});
Airport.hasMany(DailyFlight, {
  foreignKey: "destination_airport_id",
  as: "DestinationFlightssDaily",
});
DailyFlight.belongsTo(Airport, {
  foreignKey: "origin_airport_id",
  as: "OriginDaily",
});
DailyFlight.belongsTo(Airport, {
  foreignKey: "destination_airport_id",
  as: "DestinationDaily",
});

// Belt
Belt.hasMany(SeasonFlight, { foreignKey: "belt_id" });
SeasonFlight.belongsTo(Belt, { foreignKey: "belt_id" });
Belt.hasMany(DailyFlight, { foreignKey: "belt_id" });
DailyFlight.belongsTo(Belt, { foreignKey: "belt_id" });
// Gate
Gate.hasMany(SeasonFlight, { foreignKey: "gate_id" });
SeasonFlight.belongsTo(Gate, { foreignKey: "gate_id" });
Gate.hasMany(DailyFlight, { foreignKey: "gate_id" });
DailyFlight.belongsTo(Gate, { foreignKey: "gate_id" });
// Direction
Direction.hasMany(SeasonFlight, { foreignKey: "direction_id" });
SeasonFlight.belongsTo(Direction, { foreignKey: "direction_id" });
Direction.hasMany(DailyFlight, { foreignKey: "direction_id" });
DailyFlight.belongsTo(Direction, { foreignKey: "direction_id" });
// Aircraft Type
AircraftType.hasMany(SeasonFlight, { foreignKey: "aircraft_type_id" });
SeasonFlight.belongsTo(AircraftType, { foreignKey: "aircraft_type_id" });
AircraftType.hasMany(DailyFlight, { foreignKey: "aircraft_type_id" });
DailyFlight.belongsTo(AircraftType, { foreignKey: "aircraft_type_id" });
// Flight Category
FlightCategory.hasMany(SeasonFlight, { foreignKey: "flight_category_id" });
SeasonFlight.belongsTo(FlightCategory, { foreignKey: "flight_category_id" });
FlightCategory.hasMany(DailyFlight, { foreignKey: "flight_category_id" });
DailyFlight.belongsTo(FlightCategory, { foreignKey: "flight_category_id" });
// Terminal
Terminal.hasMany(SeasonFlight, { foreignKey: "terminal_id" });
SeasonFlight.belongsTo(Terminal, { foreignKey: "terminal_id" });
Terminal.hasMany(DailyFlight, { foreignKey: "terminal_id" });
DailyFlight.belongsTo(Terminal, { foreignKey: "terminal_id" });

// Flight Status
FlightStatus.hasMany(DailyFlight, { foreignKey: "flight_status_id" });
DailyFlight.belongsTo(FlightStatus, { foreignKey: "flight_status_id" });
// Season Flight
SeasonFlight.hasMany(DailyFlight, { foreignKey: "season_flight_id" });
DailyFlight.belongsTo(SeasonFlight, { foreignKey: "season_flight_id" });
// Daily Flight
DailyFlight.belongsTo(SeasonFlight, { foreignKey: "season_flight_id" });

if (env !== "production") {
  sequelize
    .sync()
    .then(() => {
      console.log("Database & tables synced!");
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
    });
}

module.exports = {
  sequelize,
  User,
  Role,
  Airline,
  Airport,
  Belt,
  Gate,
  Direction,
  AircraftType,
  FlightCategory,
  Terminal,
  Counter,
  FlightStatus,
  SeasonFlight,
  DailyFlight,
};
