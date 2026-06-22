// models/user.js
const bcryptjs = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "role_id",
        },
      },
      airline_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "airlines",
          key: "airline_id",
        },
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_login: {
        type: DataTypes.DATE,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      tableName: 'users',
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.validPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
  };


  return User;
};
