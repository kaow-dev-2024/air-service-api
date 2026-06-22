const {
  Belt,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Belt.findAll({
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
    const item = await Belt.findOne({
      where: { belt_id: id  },
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
  const beltData = req.body;

  try {
    const existingBelt = await Belt.findOne({
      where: { name: beltData.name },
    });

    if (existingBelt) {
      return res.status(409).json({ message: "Belt already taken" });
    }

    const beltCreated = await Belt.create(beltData);
    if (beltCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const beltData = req.body;

  try {
    const beltUpdated = await Belt.update(beltData, {
      where: {
        belt_id: id,
      },
    });
    if (beltUpdated) {
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
    const beltDelete = await Belt.destroy({
      where: {
        belt_id: id,
      },
    });

    if (!beltDelete) {
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

