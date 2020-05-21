require("dotenv").config;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3300,
  }
);

module.exports = { Sequelize, sequelize };
