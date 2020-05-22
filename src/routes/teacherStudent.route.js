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

const commonStudents = async (req, res, next) => {
  try {
    const teacherQuery = req.query.teacher;
    if (!teacherQuery) {
      throw new Error("No teacher input");
    }
    const allTeacherStudents = await teacherModel.findOne({
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
    if (!allTeacherStudents) {
      throw new Error("Invalid teacher input");
    }
    const onlyStudents = allTeacherStudents.students;
    const studentsInArr = onlyStudents.map((eachStudent) => {
      return eachStudent["students"];
    });
    const studentObj = { students: studentsInArr };
    res.send(studentObj);
  } catch (err) {
    if (err.message === "Invalid teacher input" || "No teacher input") {
      err.statusCode = 422;
    }
    next(err);
  }
};

router.post("/register", registerStudents);
router.get("/commonstudents", commonStudents);

module.exports = router;
