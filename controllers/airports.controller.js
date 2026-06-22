const {
  Airport,
} = require("../models");
const { Op } = require('sequelize');

const find = async (req, res) => {
  try {
    const items = await Airport.findAll({
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
    const item = await Airport.findOne({
      where: { airport_id: id  },
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
  const airportData = req.body;

  try {
    const existingAirport = await Airport.findOne({
      where: {
        [Op.or]: [{ name: airportData.name }, { iata_code: airportData.iata_code }, { icao_code: airportData.icao_code }],
      },
    });

    if (existingAirport) {
      return res.status(409).json({ message: "Airport already taken" });
    }

    const airportCreated = await Airport.create(airportData);
    if (airportCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const airportData = req.body;

  try {
    const airportUpdated = await Airport.update(airportData, {
      where: {
        airport_id: id,
      },
    });
    if (airportUpdated) {
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
    const airportDelete = await Airport.destroy({
      where: {
        airport_id: id,
      },
    });

    if (!airportDelete) {
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

