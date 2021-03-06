const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const Sequelize = require("sequelize");
const { unavailableTeacherErrorHandler } = require("../utils/helperFunctions");

const registerTeacherStudent = async (teacherInput, studentInput) => {
  const [registeredTeacher, created] = await teacherModel.findOrCreate({
    where: {
      teacher: teacherInput,
    },
  });
  for (let i = 0; i < studentInput.length; i++) {
    const [registeredStudent, created] = await studentModel.findOrCreate({
      where: {
        student: studentInput[i],
      },
    });
    await registeredStudent.addTeacher(registeredTeacher);
  }
};

const manyTeachersCommonStudents = async (teacherQuery) => {
  const allTeacherStudents = [];
  for (let i = 0; i < teacherQuery.length; i++) {
    const perTeacherStudent = await teacherModel.findOne({
      where: {
        teacher: teacherQuery[i],
      },
      attributes: [],
      include: {
        model: studentModel,
        attributes: ["student"],
        through: { attributes: [] },
      },
    });
    unavailableTeacherErrorHandler(perTeacherStudent);
    allTeacherStudents.push(perTeacherStudent.students);
  }
  return allTeacherStudents.flat();
};

const singleTeacherStudents = async (teacherQuery) => {
  const oneTeacherStudents = await teacherModel.findOne({
    where: {
      teacher: teacherQuery,
    },
    attributes: ["teacher"],
    include: {
      model: studentModel,
      attributes: ["student"],
      through: { attributes: [] },
      plain: true,
    },
  });
  unavailableTeacherErrorHandler(oneTeacherStudents);
  const onlyStudents = oneTeacherStudents.students;

  return onlyStudents;
};

const suspendingStudent = async (studentInput) => {
  const findStudent = await studentModel.findOne({
    where: { student: studentInput },
  });
  if (!findStudent) {
    throw new Error("Student invalid or does not exist.");
  }
  await studentModel.update(
    {
      suspended: true,
    },
    {
      where: { student: studentInput },
    }
  );
};

const getMentionedStudents = async (notificationInput) => {
  const mentionedStudents = notificationInput
    .split(" ")
    .filter((eachStudent) => {
      return eachStudent.indexOf("@") === 0;
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
  if (mentionedStudents.length !== notSuspendedMentionedStudents.length) {
    throw new Error("Not all students mentioned are found.");
  }
  return notSuspendedMentionedStudents;
};

const getStudentsRegisteredToTeacher = async (teacherInput) => {
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
  unavailableTeacherErrorHandler(studentsRegisteredToTeacher);
  const studentList = studentsRegisteredToTeacher.students;
  return studentList;
};

module.exports = {
  registerTeacherStudent,
  manyTeachersCommonStudents,
  singleTeacherStudents,
  suspendingStudent,
  getMentionedStudents,
  getStudentsRegisteredToTeacher,
};
