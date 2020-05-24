const express = require("express");
const router = express.Router();
const {
  studentsComplilation,
  moreThanOneTeacherErrorHandler,
} = require("../utils/helperFunctions");
const {
  registerTeacherStudent,
  manyTeachersCommonStudents,
  singleTeacherStudents,
  suspendingStudent,
  getMentionedStudents,
  getStudentsRegisteredToTeacher,
} = require("../DAO/teacherStudentDAO");

const registerStudents = async (req, res, next) => {
  try {
    const teacherInput = req.body.teacher;
    const studentInput = req.body.students;
    moreThanOneTeacherErrorHandler(teacherInput);
    if (!teacherInput || !studentInput) {
      throw new Error("Missing teacher or student input");
    }
    await registerTeacherStudent(teacherInput, studentInput);
    res.status(204).send();
  } catch (err) {
    if (
      err.message === "Missing teacher or student input" ||
      "Only one teacher input allowed."
    ) {
      err.statusCode = 422;
    }
    next(err);
  }
};

const getCommonStudents = async (req, res, next) => {
  const teacherQuery = req.query.teacher;
  try {
    if (!teacherQuery) {
      throw new Error("No teacher input");
    }
    const numberofTeachers = teacherQuery.length;
    const moreThanOneTeacher = Array.isArray(teacherQuery);
    if (moreThanOneTeacher) {
      const commonStudents = await manyTeachersCommonStudents(
        teacherQuery,
        numberofTeachers
      );
      const studentList = studentsComplilation(commonStudents);
      const formattedStudentList = { students: studentList };
      res.send(formattedStudentList);
    } else {
      const oneTeacherStudents = await singleTeacherStudents(teacherQuery);
      const studentList = studentsComplilation(oneTeacherStudents);
      const formattedStudentList = {
        teacher: teacherQuery,
        students: studentList,
      };
      res.send(formattedStudentList);
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
  const moreThanOneStudent = Array.isArray(studentInput);
  try {
    if (!studentInput) {
      throw new Error("Missing student input.");
    }
    if (moreThanOneStudent && studentInput.length > 1) {
      throw new Error("Only one student input allowed.");
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
    moreThanOneTeacherErrorHandler(teacherInput);
    if (!teacherInput || !notificationInput) {
      throw new Error("Missing teacher or notification input.");
    }
    const registeredStudentsResult = await getStudentsRegisteredToTeacher(
      teacherInput
    );
    const mentionedStudentsResult = await getMentionedStudents(
      notificationInput
    );

    const validStudents = registeredStudentsResult.concat(
      mentionedStudentsResult
    );
    const studentList = studentsComplilation(validStudents);
    const uniqueStudents = studentList.filter((name, index) => {
      return studentList.indexOf(name) === index;
    });
    const recipients = { recipients: uniqueStudents };
    res.status(200).send(recipients);
  } catch (err) {
    if (
      err.message === "Missing teacher or notification input." ||
      "Not all students mentioned are found." ||
      "Teacher input unavailable or invalid."
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
