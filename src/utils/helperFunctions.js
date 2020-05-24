const studentsComplilation = (onlyStudents) => {
  const studentsInArr = onlyStudents.map((eachStudent) => {
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

module.exports = { studentsComplilation, moreThanOneTeacherErrorHandler };
