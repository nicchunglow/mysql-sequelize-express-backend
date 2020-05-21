const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const express = require("express");
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

router.post("/register", registerStudents);

module.exports = router;
