const { Op } = require('sequelize');
const {
  FlightStatus,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await FlightStatus.findAll({
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
    const item = await FlightStatus.findOne({
      where: { flight_status_id: id  },
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
  const flight_statusData = req.body;

  try {
    const existingFlightStatus = await FlightStatus.findOne({
      where: { name: flight_statusData.name },
    });

    if (existingFlightStatus) {
      return res.status(409).json({ message: "FlightStatus already taken" });
    }

    const flight_statusCreated = await FlightStatus.create(flight_statusData);
    if (flight_statusCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const flight_statusData = req.body;

  try {
    const flight_statusUpdated = await FlightStatus.update(flight_statusData, {
      where: {
        flight_status_id: id,
      },
    });
    if (flight_statusUpdated) {
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
    const flight_statusDelete = await FlightStatus.destroy({
      where: {
        flight_status_id: id,
      },
    });

    if (!flight_statusDelete) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Removed Successfully" });
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
};

