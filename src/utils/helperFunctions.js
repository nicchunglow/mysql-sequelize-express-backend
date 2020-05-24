const studentsComplilation = (onlyStudents) => {
  const studentsInArr = onlyStudents.map((eachStudent) => {
    return eachStudent["student"];
  });
  return studentsInArr;
};

module.exports = { studentsComplilation };
