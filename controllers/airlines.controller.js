const {
  Airline,
} = require("../models");
const { Op } = require('sequelize');

const find = async (req, res) => {
  try {
    const items = await Airline.findAll({
    });

    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Airline.findOne({
      where: { airline_id: id  },
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
  const airlineData = req.body;

  try {
    const existingAirline = await Airline.findOne({
      where: {
        [Op.or]: [{ name: airlineData.name }, { iata_code: airlineData.iata_code }, { icao_code: airlineData.icao_code }],
      },
    });

    if (existingAirline) {
      return res.status(409).json({ message: "Airline already taken" });
    }

    const airlineCreated = await Airline.create(airlineData);
    if (airlineCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const airlineData = req.body;

  try {
    const airlineUpdated = await Airline.update(airlineData, {
      where: {
        airline_id: id,
      },
    });
    if (airlineUpdated) {
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
    const airlineDelete = await Airline.destroy({
      where: {
        airline_id: id,
      },
    });

    if (!airlineDelete) {
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

