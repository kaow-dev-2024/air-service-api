const { User } = require("../models");

const moment = require("moment");
const bcryptjs = require("bcryptjs");
moment.locale("th");

const find = async (req, res) => {
  try {
    const items = await User.findAll({
      include: { all: true },
      order: [["user_id", "DESC"]],
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
    const item = await User.findOne({
      where: { user_id: id  },
      include: { all: true },
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
  const userData = req.body;

  try {
    const existingUser = await User.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already taken" });
    }

    const userCreated = await User.create(userData);
    if (userCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const userUpdated = await User.update(userData, {
      where: {
        user_id: id,
      },
    });
    if (userUpdated) {
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
    const userDelete = await User.destroy({
      where: {
        user_id: id,
      },
    });

    if (!userDelete) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Removed Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const filter = async (req, res) => {
  const userData = req.body;

  let filter = [];
  if (userData.StationId) {
    filter.push({ StationId: userData.StationId });
  }
  if (userData.CompanyId) {
    filter.push({ CompanyId: userData.CompanyId });
  }
  if (userData.DepartmentId) {
    filter.push({ DepartmentId: userData.DepartmentId });
  }

  try {
    const item = await User.findAll({
      where: filter,
      include: { all: true },
      order: [["user_id", "DESC"]],
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

const changePassword = async (req, res) => {
  const userData = req.body;

  const salt = await bcryptjs.genSalt(10);
  let passwordHash = await bcryptjs.hash(userData.new_password, salt);
  // console.log("passwordHash", passwordHash);

  try {
    const updatePassword = await User.update(
      {
        password: passwordHash,
      },
      {
        where: {
          user_id: userData.user_id,
        },
      },
    );

    if (updatePassword) {
      res.status(200).json({ message: "Updated Password Successfully" });
    }
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
  filter,
  changePassword,
};

