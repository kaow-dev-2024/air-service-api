const {
  Role,
} = require("../models");

const find = async (req, res) => {
  try {
    const items = await Role.findAll({
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
    const item = await Role.findOne({
      where: { role_id: id  },
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
  const roleData = req.body;

  try {
    const existingRole = await Role.findOne({
      where: { name: roleData.name },
    });

    if (existingRole) {
      return res.status(409).json({ message: "Role already taken" });
    }

    const roleCreated = await Role.create(roleData);
    if (roleCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const roleData = req.body;

  try {
    const roleUpdated = await Role.update(roleData, {
      where: {
        role_id: id,
      },
    });
    if (roleUpdated) {
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
    const roleDelete = await Role.destroy({
      where: {
        role_id: id,
      },
    });

    if (!roleDelete) {
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

