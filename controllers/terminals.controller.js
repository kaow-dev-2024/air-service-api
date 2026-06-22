const {
  Terminal,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Terminal.findAll({
      order: [
        ['terminal_id', 'DESC'],
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
    const item = await Terminal.findOne({
      where: { terminal_id: id  },
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
  const terminalData = req.body;

  try {
    const existingTerminal = await Terminal.findOne({
      where: { name: terminalData.name },
    });

    if (existingTerminal) {
      return res.status(409).json({ message: "Terminal already taken" });
    }

    const terminalCreated = await Terminal.create(terminalData);
    if (terminalCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const terminalData = req.body;

  try {
    const terminalUpdated = await Terminal.update(terminalData, {
      where: {
        terminal_id: id,
      },
    });
    if (terminalUpdated) {
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
    const terminalDelete = await Terminal.destroy({
      where: {
        terminal_id: id,
      },
    });

    if (!terminalDelete) {
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

