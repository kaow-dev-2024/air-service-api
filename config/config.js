require("dotenv").config();

const sharedConfig = {
  username: process.env.DB_USERNAME || process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
};

module.exports = {
  development: {
    ...sharedConfig,
  },
  production: {
    ...sharedConfig,
    logging: false,
  },
};
