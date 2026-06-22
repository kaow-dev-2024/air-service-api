const {
  Gate,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Gate.findAll({
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
    const item = await Gate.findOne({
      where: { gate_id: id  },
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
  const gateData = req.body;

  try {
    const existingGate = await Gate.findOne({
      where: { name: gateData.name },
    });

    if (existingGate) {
      return res.status(409).json({ message: "Gate already taken" });
    }

    const gateCreated = await Gate.create(gateData);
    if (gateCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const gateData = req.body;

  try {
    const gateUpdated = await Gate.update(gateData, {
      where: {
        gate_id: id,
      },
    });
    if (gateUpdated) {
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
    const gateDelete = await Gate.destroy({
      where: {
        gate_id: id,
      },
    });

    if (!gateDelete) {
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

