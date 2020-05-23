const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");
const Sequelize = require("sequelize");

const studentsComplilation = (onlyStudents) => {
  const studentsInArr = onlyStudents.map((eachStudent) => {
    return eachStudent["student"];
  });
  return studentsInArr;
};

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

const manyTeachersCommonStudent = async (teacherQuery, numberofTeachers) => {
  const allTeacherStudents = await teacherModel.findAll({
    where: {
      teacher: teacherQuery,
    },
    attributes: ["teacher"],
    include: {
      model: studentModel,
      attributes: ["student"],
      through: { attributes: [] },
    },
    group: ["student"],
    having: Sequelize.literal(`COUNT(student) = ${numberofTeachers}`),
    plain: true,
  });
  const onlyStudents = allTeacherStudents.students;
  const studentList = studentsComplilation(onlyStudents);
  const formattedStudentList = { students: studentList };
  return formattedStudentList;
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
  if (!oneTeacherStudents) {
    throw new Error("Teacher input unavailable or invalid.");
  }
  const onlyStudents = oneTeacherStudents.students;
  const studentList = studentsComplilation(onlyStudents);
  const formattedStudentList = { students: studentList };
  return formattedStudentList;
};

const suspendingStudent = async (studentInput) => {
  const suspendedStudent = await studentModel.update(
    {
      suspended: true,
    },
    {
      where: { student: studentInput },
    }
  );
  if (!suspendedStudent) {
    throw new Error("Student invalid or does not exist.");
  }
};

const getMentionedStudents = async (notificationInput) => {
  const mentionedStudents = notificationInput
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
  const studentList = studentsRegisteredToTeacher.students;
  return studentList;
};
module.exports = {
  registerTeacherStudent,
  manyTeachersCommonStudent,
  singleTeacherStudents,
  suspendingStudent,
  getMentionedStudents,
  getStudentsRegisteredToTeacher,
  studentsComplilation,
};
