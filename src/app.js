const express = require("express");
const app = express();
const teacherStudentRouter = require("./routes/teacherStudent.route");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", teacherStudentRouter);

app.get("/", (req, res) => {
  res.json({
    "0": "GET   /",
    "1": "POST   /register",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
