const { Sequelize, sequelize } = require("../utils/db");
const Student = require("./student.model");

const Teacher = sequelize.define("teachers", {
  teacher: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: { args: true, msg: "Valid email is required" },
    },
  },
});

Student.belongsToMany(Teacher, {
  through: "teachersAndStudents",
});

Teacher.belongsToMany(Student, {
  through: "teachersAndStudents",
});

sequelize.sync();

module.exports = Teacher;
