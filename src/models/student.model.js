const { Sequelize, sequelize } = require("../utils/db");

const Student = sequelize.define("students", {
  student: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: { args: true, msg: "Valid email is required" },
    },
  },
  suspended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Student;
