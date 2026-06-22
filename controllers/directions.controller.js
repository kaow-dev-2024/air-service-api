const {
  Direction,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Direction.findAll({
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
    const item = await Direction.findOne({
      where: { direction_id: id  },
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
  const directionData = req.body;

  try {
    const existingDirection = await Direction.findOne({
      where: { name: directionData.name },
    });

    if (existingDirection) {
      return res.status(409).json({ message: "Direction already taken" });
    }

    const directionCreated = await Direction.create(directionData);
    if (directionCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const directionData = req.body;

  try {
    const directionUpdated = await Direction.update(directionData, {
      where: {
        direction_id: id,
      },
    });
    if (directionUpdated) {
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
    const directionDelete = await Direction.destroy({
      where: {
        direction_id: id,
      },
    });

    if (!directionDelete) {
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

