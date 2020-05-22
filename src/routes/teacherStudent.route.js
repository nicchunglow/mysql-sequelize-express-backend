const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

const registerStudents = async (req, res, next) => {
  const teacherInput = req.body.teacher;
  const studentsInput = req.body.students;
  try {
    if (!teacherInput || !studentsInput) {
      throw new Error("Missing teacher or student input");
    }
    const [registeredTeacher, created] = await teacherModel.findOrCreate({
      where: {
        teacher: teacherInput,
      },
    });
    for (let i = 0; i < studentsInput.length; i++) {
      const [registeredStudent, created] = await studentModel.findOrCreate({
        where: {
          students: studentsInput[i],
        },
      });
      await registeredStudent.addTeacher(registeredTeacher);
    }
    res.status(204).send();
  } catch (err) {
    if (err.message === "Missing teacher or student input") {
      err.statusCode = 422;
    }
    next(err);
  }
};

const getCommonStudents = async (req, res, next) => {
  const teacherQuery = req.query.teacher;
  const numberofTeachers = teacherQuery.length;
  try {
    if (!teacherQuery) {
      throw new Error("No teacher input");
    }
    const morethanOneTeacher = Array.isArray(teacherQuery);
    if (morethanOneTeacher) {
      const allTeacherStudents = await teacherModel.findAll({
        where: {
          teacher: teacherQuery,
        },
        attributes: ["teacher"],
        include: {
          model: studentModel,
          attributes: ["students"],
          through: { attributes: [] },
        },
        group: ["students"],
        having: Sequelize.literal(`COUNT(students) = ${numberofTeachers}`),
      });
      const onlyStudents = allTeacherStudents[0].students;
      const studentsInArr = onlyStudents.map((eachStudent) => {
        return eachStudent["students"];
      });
      const studentJson = { students: studentsInArr };
      res.send(allTeacherStudents);
    } else {
      const oneTeacherStudents = await teacherModel.findOne({
        where: {
          teacher: teacherQuery,
        },
        attributes: ["teacher"],
        include: {
          model: studentModel,
          attributes: ["students"],
          through: { attributes: [] },
        },
      });
      if (!oneTeacherStudents) {
        throw new Error("Teacher input unavailable or invalid.");
      }
      const onlyStudents = oneTeacherStudents.students;
      const studentsInArr = onlyStudents.map((eachStudent) => {
        return eachStudent["students"];
      });
      const studentJson = { students: studentsInArr };
      res.send(studentJson);
    }
  } catch (err) {
    if (
      err.message === "Teacher input unavailable or invalid." ||
      "No teacher input"
    ) {
      err.statusCode = 422;
    }
    next(err);
  }
};

router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);

module.exports = router;
