const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3300,
  }
);



module.exports = { Sequelize, sequelize };
