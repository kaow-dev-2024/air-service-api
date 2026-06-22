const {
  Counter,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Counter.findAll({
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
    const item = await Counter.findOne({
      where: { counter_id: id  },
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
  const counterData = req.body;

  try {
    const existingCounter = await Counter.findOne({
      where: { name: counterData.name },
    });

    if (existingCounter) {
      return res.status(409).json({ message: "Counter already taken" });
    }

    const counterCreated = await Counter.create(counterData);
    if (counterCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const counterData = req.body;

  try {
    const counterUpdated = await Counter.update(counterData, {
      where: {
        counter_id: id,
      },
    });
    if (counterUpdated) {
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
    const counterDelete = await Counter.destroy({
      where: {
        counter_id: id,
      },
    });

    if (!counterDelete) {
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

