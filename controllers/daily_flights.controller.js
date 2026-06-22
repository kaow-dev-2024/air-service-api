const { DailyFlight, SeasonFlight, Airline } = require("../models");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
require("dotenv").config();

const find = async (req, res) => {
  try {
    const items = await DailyFlight.findAll({
      include: { all: true },
      order: [
        ["flight_date", "ASC"],
        ["std", "ASC"],
        ["sta", "ASC"],
      ],
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await DailyFlight.findOne({
      where: { daily_flight_id: id  },
      include: { all: true },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const create = async (req, res) => {
  const dailyFlightData = req.body;

  if (dailyFlightData.direction_id == 1) {
    dailyFlightData.gate_id = null;
    dailyFlightData.counters = [];
    dailyFlightData.etd = dailyFlightData.std;
    dailyFlightData.atd = dailyFlightData.std;
    dailyFlightData.atd = null;
  }
  if (dailyFlightData.direction_id == 2) {
    dailyFlightData.belt_id = null;
    dailyFlightData.eta = dailyFlightData.sta;
    dailyFlightData.ata = dailyFlightData.sta;
    dailyFlightData.ata = null;
  }
  if (!dailyFlightData.is_code_share) {
    dailyFlightData.code_shares = [];
  }

  let stdUtc = moment
    .tz(dailyFlightData.std, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let staUtc = moment
    .tz(dailyFlightData.sta, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let etdUtc = moment
    .tz(dailyFlightData.etd, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let etaUtc = moment
    .tz(dailyFlightData.eta, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let atdUtc = null;
  if (dailyFlightData.atd) {
    atdUtc = moment
      .tz(dailyFlightData.atd, "HH:mm", process.env.TIME_ZONE)
      .utc()
      .format("HH:mm");
  }
  let ataUtc = null;
  if (dailyFlightData.ata) {
    ataUtc = moment
      .tz(dailyFlightData.ata, "HH:mm", process.env.TIME_ZONE)
      .utc()
      .format("HH:mm");
  }
  dailyFlightData.std = stdUtc;
  dailyFlightData.sta = staUtc;
  dailyFlightData.etd = etdUtc;
  dailyFlightData.eta = etaUtc;
  dailyFlightData.atd = atdUtc;
  dailyFlightData.ata = ataUtc;

  dailyFlightData.checkin_open = null;
  dailyFlightData.checkin_close = null;
  dailyFlightData.boarding_time = null;
  dailyFlightData.first_bag = null;
  dailyFlightData.last_bag = null;

  const airline = await Airline.findOne({
    where: { airline_id: dailyFlightData.airline_id  },
  });
  if (dailyFlightData.flight_category_id == 1) {
    // Domestic
    if (dailyFlightData.direction_id == 1) {
      // Arrival
      dailyFlightData.first_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.first_bag_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.last_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.last_bag_dom, "minutes")
        .format("HH:mm");
    } else if (dailyFlightData.direction_id == 2) {
      // Departure
      dailyFlightData.checkin_open = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_open_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.checkin_close = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_close_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.boarding_time = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.boarding_time_dom, "minutes")
        .format("HH:mm");
    }
  } else if (dailyFlightData.flight_category_id == 2) {
    // International
    if (dailyFlightData.direction_id == 1) {
      // Arrival
      dailyFlightData.first_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.first_bag_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.last_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.last_bag_inter, "minutes")
        .format("HH:mm");
    } else if (dailyFlightData.direction_id == 2) {
      // Departure
      dailyFlightData.checkin_open = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_open_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.checkin_close = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_close_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.boarding_time = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.boarding_time_inter, "minutes")
        .format("HH:mm");
    }
  }

  // return res.json(dailyFlightData);
  try {
    // const existingDailyFlight = await DailyFlight.findOne({
    //   where: { name: dailyFlightData.name },
    // });

    // if (existingDailyFlight) {
    //   return res.status(409).json({ message: "DailyFlight already taken" });
    // }

    const dailyFlightCreated = await DailyFlight.create(dailyFlightData);
    if (dailyFlightCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const dailyFlightData = req.body;
  if (dailyFlightData.direction_id == 1) {
    dailyFlightData.gate_id = null;
    dailyFlightData.counters = [];
    dailyFlightData.atd = null;
  }
  if (dailyFlightData.direction_id == 2) {
    dailyFlightData.belt_id = null;
    dailyFlightData.ata = null;
  }
  if (!dailyFlightData.is_code_share) {
    dailyFlightData.code_shares = [];
  }
  let stdUtc = moment
    .tz(dailyFlightData.std, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let staUtc = moment
    .tz(dailyFlightData.sta, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let etdUtc = moment
    .tz(dailyFlightData.etd, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let etaUtc = moment
    .tz(dailyFlightData.eta, "HH:mm", process.env.TIME_ZONE)
    .utc()
    .format("HH:mm");
  let atdUtc = null;
  if (dailyFlightData.atd) {
    atdUtc = moment
      .tz(dailyFlightData.atd, "HH:mm", process.env.TIME_ZONE)
      .utc()
      .format("HH:mm");
  }
  let ataUtc = null;
  if (dailyFlightData.ata) {
    ataUtc = moment
      .tz(dailyFlightData.ata, "HH:mm", process.env.TIME_ZONE)
      .utc()
      .format("HH:mm");
  }

  dailyFlightData.std = stdUtc;
  dailyFlightData.sta = staUtc;
  dailyFlightData.etd = etdUtc;
  dailyFlightData.eta = etaUtc;
  dailyFlightData.atd = atdUtc;
  dailyFlightData.ata = ataUtc;

  dailyFlightData.checkin_open = null;
  dailyFlightData.checkin_close = null;
  dailyFlightData.boarding_time = null;
  dailyFlightData.first_bag = null;
  dailyFlightData.last_bag = null;

  const airline = await Airline.findOne({
    where: { airline_id: dailyFlightData.airline_id  },
  });
  if (dailyFlightData.flight_category_id == 1) {
    // Domestic
    if (dailyFlightData.direction_id == 1) {
      // Arrival
      dailyFlightData.first_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.first_bag_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.last_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.last_bag_dom, "minutes")
        .format("HH:mm");
    } else if (dailyFlightData.direction_id == 2) {
      // Departure
      dailyFlightData.checkin_open = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_open_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.checkin_close = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_close_dom, "minutes")
        .format("HH:mm");
      dailyFlightData.boarding_time = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.boarding_time_dom, "minutes")
        .format("HH:mm");
    }
  } else if (dailyFlightData.flight_category_id == 2) {
    // International
    if (dailyFlightData.direction_id == 1) {
      // Arrival
      dailyFlightData.first_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.first_bag_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.last_bag = moment(dailyFlightData.sta, "HH:mm")
        .add(airline.last_bag_inter, "minutes")
        .format("HH:mm");
    } else if (dailyFlightData.direction_id == 2) {
      // Departure
      dailyFlightData.checkin_open = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_open_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.checkin_close = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.checkin_close_inter, "minutes")
        .format("HH:mm");
      dailyFlightData.boarding_time = moment(dailyFlightData.std, "HH:mm")
        .subtract(airline.boarding_time_inter, "minutes")
        .format("HH:mm");
    }
  }

  try {
    const dailyFlightUpdated = await DailyFlight.update(dailyFlightData, {
      where: {
        daily_flight_id: id,
      },
    });
    if (dailyFlightUpdated) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const actived = async (req, res) => {
  const { id } = req.params;
  const isActive = req.body;
  try {
    const dailyFlightUpdated = await DailyFlight.update(isActive, {
      where: {
        daily_flight_id: id,
      },
    });
    if (dailyFlightUpdated) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const forced = async (req, res) => {
  const { id } = req.params;
  const isForce = req.body;
  try {
    const dailyFlightUpdated = await DailyFlight.update(isForce, {
      where: {
        daily_flight_id: id,
      },
    });
    if (dailyFlightUpdated) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const dailyFlightDelete = await DailyFlight.destroy({
      where: {
        daily_flight_id: id,
      },
    });

    if (!dailyFlightDelete) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Removed Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const daily = async (req, res) => {
  let start_date = moment().format("YYYY-MM-DD");
  let end_date = moment().format("YYYY-MM-DD");

  try {
    let items = await DailyFlight.findAll({
      where: {
        flight_date: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      },
      include: { all: true },
      order: [["flight_date", "ASC"]],
    });
    if (!items) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const weekly = async (req, res) => {
  const start_date = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const end_date = moment().endOf("isoWeek").format("YYYY-MM-DD");

  try {
    let items = await DailyFlight.findAll({
      where: {
        flight_date: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      },
      include: { all: true },
      order: [["flight_date", "ASC"]],
    });
    if (!items) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const monthly = async (req, res) => {
  const start_date = moment().startOf("month").format("YYYY-MM-DD");
  const end_date = moment().endOf("month").format("YYYY-MM-DD");

  try {
    let items = await DailyFlight.findAll({
      where: {
        flight_date: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      },
      include: { all: true },
      order: [["flight_date", "ASC"]],
    });
    if (!items) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const year = async (req, res) => {
  const start_date = moment().startOf("year").format("YYYY-MM-DD");
  const end_date = moment().endOf("year").format("YYYY-MM-DD");

  try {
    let items = await DailyFlight.findAll({
      where: {
        flight_date: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      },
      include: { all: true },
      order: [["flight_date", "ASC"]],
    });
    if (!items) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  find,
  findOne,
  create,
  update,
  remove,
  daily,
  weekly,
  monthly,
  year,
  actived,
  forced,
};

