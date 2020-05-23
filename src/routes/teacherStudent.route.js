const express = require("express");
const router = express.Router();
const {
  registerTeacherStudent,
  manyTeachersCommonStudent,
  singleTeacherStudents,
  suspendingStudent,
  getMentionedStudents,
  getStudentsRegisteredToTeacher,
  studentsComplilation,
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
      throw new Error("Missing student input.");
    }
    await suspendingStudent(studentInput);
    res.status(204).send();
  } catch (err) {
    if (
      err.message === "Missing student input." ||
      "Student invalid or does not exist."
    ) {
      err.statusCode = 422;
    }
    next(err);
  }
};

const retrieveForNotification = async (req, res, next) => {
  try {
    const teacherInput = req.body.teacher;
    const notificationInput = req.body.notification;
    if (!teacherInput || !notificationInput) {
      throw new Error("Missing teacher or notification input.");
    }
    const mentionedStudentsResult = await getMentionedStudents(
      notificationInput
    );
    const registeredStudentsResult = await getStudentsRegisteredToTeacher(
      teacherInput
    );
    const validStudents = registeredStudentsResult.concat(
      mentionedStudentsResult
    );
    const studentList = studentsComplilation(validStudents);
    const recipents = { recipents: studentList };
    res.status(200).send(recipents);
  } catch (err) {
    if (
      err.message === "Missing teacher or notification input." ||
      "Not all students mentioned are found."
    ) {
      err.statusCode = 422;
    }
    next(err);
  }
};

router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudent);
router.post("/retrievefornotifications", retrieveForNotification);

module.exports = router;
