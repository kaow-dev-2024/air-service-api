const {
  FlightCategory,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await FlightCategory.findAll({
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
    const item = await FlightCategory.findOne({
      where: { flight_category_id: id  },
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
  const flight_categoryData = req.body;

  try {
    const existingFlightCategory = await FlightCategory.findOne({
      where: { name: flight_categoryData.name },
    });

    if (existingFlightCategory) {
      return res.status(409).json({ message: "FlightCategory already taken" });
    }

    const flight_categoryCreated = await FlightCategory.create(flight_categoryData);
    if (flight_categoryCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const flight_categoryData = req.body;

  try {
    const flight_categoryUpdated = await FlightCategory.update(flight_categoryData, {
      where: {
        flight_category_id: id,
      },
    });
    if (flight_categoryUpdated) {
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
    const flight_categoryDelete = await FlightCategory.destroy({
      where: {
        flight_category_id: id,
      },
    });

    if (!flight_categoryDelete) {
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

