const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const express = require("express");
// const Sequelize = require("sequelize");
const router = express.Router();
const {
  registerTeacherStudent,
  manyTeachersCommonStudent,
  singleTeacherStudents,
} = require("../DAO/teacherStudentDAO");

const registerStudents = async (req, res, next) => {
  const teacherInput = req.body.teacher;
  const studentInput = req.body.students;
  try {
    if (!teacherInput || !studentInput) {
      throw new Error("Missing teacher or student input");
    }
    await registerTeacherStudent(teacherInput, studentInput);
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
      const listOfStudents = await manyTeachersCommonStudent(
        teacherQuery,
        numberofTeachers
      );
      res.send(listOfStudents);
    } else {
      const listOfStudents = await singleTeacherStudents(teacherQuery);
      res.send(listOfStudents);
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

const suspendStudent = async (req, res, next) => {
  const studentInput = req.body.student;
  try {
    if (!studentInput) {
      throw new Error("Missing student input");
    }
    const suspendingStudent = await studentModel.findOne({
      where: {
        student: studentInput,
      },
      attributes: ["student", "suspended"],
    });
    if (!suspendingStudent) {
      throw new Error("Student invalid or does not exist.");
    }
    const suspendedStudent = await studentModel.update(
      {
        suspended: true,
      },
      {
        where: { student: studentInput },
      }
    );
    res.status(204).send();
  } catch (err) {
    if (err.message === "Student invalid or does not exist.") {
      err.statusCode = 422;
    }
    next(err);
  }
};

router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudent);

module.exports = router;
