const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const express = require("express");
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
    const registrationSuccessful = await registerTeacherStudent(
      teacherInput,
      studentInput
    );
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

router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);

module.exports = router;
