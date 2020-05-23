// const Sequelize = require("sequelize");
const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const express = require("express");
const router = express.Router();
const {
  registerTeacherStudent,
  manyTeachersCommonStudent,
  singleTeacherStudents,
  suspendingStudent,
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
    const moreThanOneTeacher = Array.isArray(teacherQuery);
    if (moreThanOneTeacher) {
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
    suspendingStudent(studentInput);
    res.status(204).send();
  } catch (err) {
    if (err.message === "Student invalid or does not exist.") {
      err.statusCode = 422;
    }
    next(err);
  }
};

const retrieveForNotification = async (req, res, next) => {
  const teacherInput = req.body.teacher;
  const notification = req.body.notification;
  const mentionedStudents = notification
    .split(" ")
    .filter((word) => {
      return word.indexOf("@") === 0;
    })
    .map((studentEmail) => {
      return studentEmail.substr(1);
    });

  const notSuspendedMentionedStudents = await studentModel.findAll({
    where: {
      student: mentionedStudents,
      suspended: false,
    },
    attributes: ["student", "suspended"],
  });

  const studentsRegisteredToTeacher = await teacherModel.findOne({
    where: {
      teacher: teacherInput,
    },
    attributes: ["teacher"],
    include: {
      model: studentModel,
      attributes: ["student", "suspended"],
      where: {
        suspended: false,
      },
      through: { attributes: [] },
    },
  });
  const studentList = studentsRegisteredToTeacher.students;
  const validStudents = studentList.concat(notSuspendedMentionedStudents);
  const studentsInArr = validStudents.map((student) => {
    return student["student"];
  });
  const recipents = { recipents: studentsInArr };
  res.status(200).send(recipents);
};

router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudent);
router.post("/retrievefornotifications", retrieveForNotification);

module.exports = router;
