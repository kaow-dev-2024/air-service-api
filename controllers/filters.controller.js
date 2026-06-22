const {
  SeasonFlight,
  DailyFlight,
  User,
  Role,
  Airline,
  Airport,
  FlightStatus,
} = require("../models");
const { Op, fn, col, where } = require("sequelize");

const toIntOrNull = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

const toBoolOrNull = (v) => {
  if (v === true || v === false) return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return null;
};

const normalizeDirectionId = (directionId, directionText) => {
  const id = toIntOrNull(directionId);
  if (id) return id;
  if (!directionText) return null;
  const s = String(directionText).trim().toLowerCase();
  if (s === "arrival") return 1;
  if (s === "departure") return 2;
  return null;
};

const normalizeCategoryId = (categoryId, categoryText) => {
  const id = toIntOrNull(categoryId);
  if (id) return id;
  if (!categoryText) return null;
  const s = String(categoryText).trim().toLowerCase();
  if (s === "domestic") return 1;
  if (s === "international") return 2;
  return null;
};

const getAirlineId = async (payload) => {
  const id = toIntOrNull(payload.airline_id);
  if (id) return id;
  if (!payload.airline) return null;
  const code = String(payload.airline).trim().toUpperCase();
  const row = await Airline.findOne({ where: { iata_code: code } });
  return row ? row.airline_id : null;
};

const getAirportId = async (idValue, iataValue) => {
  const id = toIntOrNull(idValue);
  if (id) return id;
  if (!iataValue) return null;
  const code = String(iataValue).trim().toUpperCase();
  const row = await Airport.findOne({ where: { iata_code: code } });
  return row ? row.airport_id : null;
};

const getFlightStatusId = async (payload) => {
  const id = toIntOrNull(payload.flight_status_id);
  if (id) return id;
  if (!payload.flight_status) return null;
  const name = String(payload.flight_status).trim().toLowerCase();
  const row = await FlightStatus.findOne({
    where: where(fn("lower", col("name")), name),
  });
  return row ? row.flight_status_id : null;
};

const normalizeOperationDays = (value) => {
  if (Array.isArray(value)) {
    const days = value.map((x) => toIntOrNull(x)).filter((x) => x !== null);
    return days;
  }
  return [];
};

const filterSeasonFlights = async (req, res) => {
  const payload = req.body || {};

  try {
    const filters = [];
    const directionId = normalizeDirectionId(
      payload.direction_id,
      payload.direction,
    );
    const categoryId = normalizeCategoryId(
      payload.flight_category_id,
      payload.category,
    );
    const airlineId = await getAirlineId(payload);
    const originAirportId = await getAirportId(
      payload.origin_airport_id,
      payload.origin,
    );
    const destinationAirportId = await getAirportId(
      payload.destination_airport_id,
      payload.destination,
    );
    const operationDays = normalizeOperationDays(payload.operation_days);

    if (directionId) filters.push({ direction_id: directionId });
    if (categoryId) filters.push({ flight_category_id: categoryId });
    if (payload.flight_no)
      filters.push({ flight_no: String(payload.flight_no).trim() });
    if (airlineId) filters.push({ airline_id: airlineId });
    if (originAirportId) filters.push({ origin_airport_id: originAirportId });
    if (destinationAirportId) {
      filters.push({ destination_airport_id: destinationAirportId });
    }
    if (operationDays.length > 0) {
      filters.push({ operation_days: { [Op.overlap]: operationDays } });
    }
    if (payload.startDate) {
      filters.push({ valid_from: { [Op.gte]: payload.startDate } });
    }
    if (payload.endDate) {
      filters.push({ valid_to: { [Op.lte]: payload.endDate } });
    }

    const whereClause = filters.length > 0 ? { [Op.and]: filters } : {};
    const items = await SeasonFlight.findAll({
      where: whereClause,
      include: { all: true },
      order: [["season_flight_id", "ASC"]],
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const filterDailyFlights = async (req, res) => {
  const payload = req.body || {};

  try {
    const filters = [];
    const directionId = normalizeDirectionId(
      payload.direction_id,
      payload.direction,
    );
    const categoryId = normalizeCategoryId(
      payload.flight_category_id,
      payload.category,
    );
    const airlineId = await getAirlineId(payload);
    const originAirportId = await getAirportId(
      payload.origin_airport_id,
      payload.origin,
    );
    const destinationAirportId = await getAirportId(
      payload.destination_airport_id,
      payload.destination,
    );
    const flightStatusId = await getFlightStatusId(payload);
    const operationDay = toIntOrNull(payload.operation_day);

    if (directionId) filters.push({ direction_id: directionId });
    if (categoryId) filters.push({ flight_category_id: categoryId });
    if (payload.flight_no)
      filters.push({ flight_no: String(payload.flight_no).trim() });
    if (airlineId) filters.push({ airline_id: airlineId });
    if (originAirportId) filters.push({ origin_airport_id: originAirportId });
    if (destinationAirportId) {
      filters.push({ destination_airport_id: destinationAirportId });
    }
    if (flightStatusId) filters.push({ flight_status_id: flightStatusId });
    if (operationDay) filters.push({ operation_day: operationDay });
    if (payload.startDate && payload.endDate) {
      filters.push({
        flight_date: {
          [Op.gte]: payload.startDate,
          [Op.lte]: payload.endDate,
        },
      });
    } else if (payload.startDate) {
      filters.push({ flight_date: { [Op.gte]: payload.startDate } });
    } else if (payload.endDate) {
      filters.push({ flight_date: { [Op.lte]: payload.endDate } });
    }

    const whereClause = filters.length > 0 ? { [Op.and]: filters } : {};
    const items = await DailyFlight.findAll({
      where: whereClause,
      include: { all: true },
      order: [
        ["flight_date", "ASC"],
        ["std", "ASC"],
        ["sta", "ASC"],
      ],
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const filterUsers = async (req, res) => {
  const payload = req.body || {};

  try {
    const filters = [];
    const roleId = toIntOrNull(payload.role_id);
    const airlineId = toIntOrNull(payload.airline_id);
    const isActive = toBoolOrNull(payload.is_active);

    if (roleId) {
      filters.push({ role_id: roleId });
    } else if (payload.role) {
      filters.push(
        where(
          fn("lower", col("Role.name")),
          String(payload.role).toLowerCase(),
        ),
      );
    }
    if (airlineId) filters.push({ airline_id: airlineId });
    if (isActive !== null) filters.push({ is_active: isActive });
    if (payload.username) {
      filters.push(
        where(
          fn("lower", col("User.username")),
          String(payload.username).toLowerCase(),
        ),
      );
    }
    if (payload.email) {
      filters.push(
        where(
          fn("lower", col("User.email")),
          String(payload.email).toLowerCase(),
        ),
      );
    }

    const whereClause = filters.length > 0 ? { [Op.and]: filters } : {};
    const items = await User.findAll({
      where: whereClause,
      include: [
        { model: Role, required: false },
        { model: Airline, required: false },
      ],
      attributes: { exclude: ["password"] },
      order: [["user_id", "DESC"]],
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  filterSeasonFlights,
  filterDailyFlights,
  filterUsers,
};
