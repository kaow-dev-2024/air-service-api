const {
  AircraftType,
} = require("../models");

const { Op } = require('sequelize');

const find = async (req, res) => {
  try {
    const items = await AircraftType.findAll({
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
    const item = await AircraftType.findOne({
      where: { aircraft_type_id: id  },
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
  const aircraftTypeData = req.body;

  try {
    const existingAircraftType = await AircraftType.findOne({
      where: {
        [Op.or]: [{ iata_code: aircraftTypeData.iata_code }, { icao_code: aircraftTypeData.icao_code }],
      },
    });

    if (existingAircraftType) {
      return res.status(409).json({ message: "AircraftType already taken" });
    }

    const aircraftTypeCreated = await AircraftType.create(aircraftTypeData);
    if (aircraftTypeCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const aircraftTypeData = req.body;

  try {
    const aircraftTypeUpdated = await AircraftType.update(aircraftTypeData, {
      where: {
        aircraft_type_id: id,
      },
    });
    if (aircraftTypeUpdated) {
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
    const aircraftTypeDelete = await AircraftType.destroy({
      where: {
        aircraft_type_id: id,
      },
    });

    if (!aircraftTypeDelete) {
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

