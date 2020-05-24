const studentsComplilation = (onlyStudents) => {
  const studentsInArr = onlyStudents.map((eachStudent,index) => {
    return eachStudent["student"];
  });
  return studentsInArr;
};

const moreThanOneTeacherErrorHandler = (teacherInput) => {
  const moreThanOneTeacher = Array.isArray(teacherInput);
  if (moreThanOneTeacher) {
    throw new Error("Only one teacher input allowed.");
  }
};

const unavailableTeacherErrorHandler = (teacherResult) => {
  if (!teacherResult) {
    throw new Error("Teacher input unavailable or invalid.");
  }
};

module.exports = {
  studentsComplilation,
  moreThanOneTeacherErrorHandler,
  unavailableTeacherErrorHandler,
};
