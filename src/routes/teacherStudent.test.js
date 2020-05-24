const request = require("supertest");
const app = require("../app");
const express = require("express");
const teacherModel = require("../models/teacher.model");

describe("/api", () => {
  afterEach(async () => {
    await jest.resetAllMocks();
  });

  describe("/register", () => {
    it("POST should register the teacher and student input with status 204 without showing any information", async () => {
      const expectedData = {
        teacher: "teacherken@gmail.com",
        students: ["studentjon@example.com", "studenthon@example.com"],
      };
      const response = await request(app)
        .post("/api/register")
        .send(expectedData)
        .expect(204);
      expect(response).not.toMatchObject(expectedData);
    });
    it("POST should throw error if there are empty inputs", async () => {
      const expectedData = {
        students: ["studentjon@example.com", "studenthon@example.com"],
      };
      const errorMessage = { error: "Missing teacher or student input" };
      const { body: error } = await request(app)
        .post("/api/register")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("POST should throw error if there are more than one teacher inputs", async () => {
      const expectedData = {
        teacher: ["nicholas2@gmail.com", "nicholas3@gmail.com"],
        students: ["studentjon@example.com", "studenthon@example.com"],
      };
      const errorMessage = { error: "Only one teacher input allowed." };
      const { body: error } = await request(app)
        .post("/api/register")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
  });
  describe("/commonstudents", () => {
    it("GET should get students registered to single teacher if there is only one teacher", async () => {
      const sampleTeacherQuery = "teacher=nicholas10%40gmail.com";
      const sampleTeacher = "nicholas10@gmail.com";
      const sampleData = {
        teacher: sampleTeacher,
        students: [
          "studentdick@example.com",
          "studentharry@example.com",
          "studentjon@gmail.com",
          "solokia3@example.com",
          "student_only_under_teacher_ken@gmail.com",
        ],
      };
      const response = await request(app)
        .get(`/api/commonstudents?${sampleTeacherQuery}`)
        .send()
        .expect(200);
      expect(response.body).toMatchObject(sampleData);
    });
    it("GET should get students registered multiple teachers", async () => {
      const sampleTeacher =
        "teacher=nicholas1%40gmail.com&teacher=nicholas2%40gmail.com";
      const sampleData = {
        students: ["studentdick@example.com", "studentharry@example.com"],
      };
      const response = await request(app)
        .get(`/api/commonstudents?${sampleTeacher}`)
        .send()
        .expect(200);
      expect(response.body).toMatchObject(sampleData);
    });
    it("GET should throw error if there is no teacher input", async () => {
      const errorMessage = { error: "No teacher input" };
      const { body: error } = await request(app)
        .get(`/api/commonstudents?teacher=`)
        .send()
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("GET should throw error if teacher input is unavailable or invalid", async () => {
      const errorMessage = { error: "Teacher input unavailable or invalid." };
      const { body: error } = await request(app)
        .get(`/api/commonstudents?teacher=wrong%40email.com`)
        .send()
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("GET should throw error if one of the teacher inputs is invalid", async () => {
      const sampleTeachers =
        "teacher=nicholas1%40gmail.com&teacher=wrong%teacher.com";
      const errorMessage = { error: "Teacher input unavailable or invalid." };
      const { body: error } = await request(app)
        .get(`/api/commonstudents?${sampleTeachers}`)
        .send()
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
  });
  describe("/suspend", () => {
    it("POST should return a status 204 when a student is suspended", async () => {
      const expectedData = {
        student: "studentjon@example.com",
      };
      const errorMessage = { error: "Teacher input unavailable or invalid." };
      const response = await request(app)
        .post("/api/suspend")
        .send(expectedData)
        .expect(204);
      expect(response).not.toMatchObject(expectedData);
    });
    it("POST should throw error when missing student input", async () => {
      const expectedData = {};
      const errorMessage = { error: "Missing student input." };
      const { body: error } = await request(app)
        .post("/api/suspend")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("POST should throw error when student to suspend does not exist", async () => {
      const expectedData = { student: "wrong" };
      const errorMessage = { error: "Student invalid or does not exist." };
      const { body: error } = await request(app)
        .post("/api/suspend")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("POST should throw error when more than one student is in input to suspend", async () => {
      const expectedData = {
        student: [
          "studentjon@example.com",
          "student_only_under_teacher_ken@gmail.com",
        ],
      };
      const errorMessage = { error: "Only one student input allowed." };
      const { body: error } = await request(app)
        .post("/api/suspend")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
  });
  describe("/retrievefornotifications", () => {
    it("POST should retrieve students inclusive of mentions, without duplicates", async () => {
      const expectedData = {
        teacher: "nicholas10@gmail.com",
        notification:
          "Hello students! @solokia2@example.com @solokia3@example.com",
      };
      const expectedResult = {
        recipients: [
          "studentjon@gmail.com",
          "solokia3@example.com",
          "student_only_under_teacher_ken@gmail.com",
          "solokia2@example.com",
        ],
      };
      const response = await request(app)
        .post("/api/retrievefornotifications")
        .send(expectedData)
        .expect(200);
      expect(response.body).toMatchObject(expectedResult);
    });
    it("POST should throw error when input is empty", async () => {
      const expectedData = {};
      const errorMessage = { error: "Missing teacher or notification input." };
      const { body: error } = await request(app)
        .post("/api/retrievefornotifications")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("POST should throw error when teacher input is unavailable", async () => {
      const expectedData = {
        teacher: "wrong@teacher.com",
        notification:
          "Hello students! @student_only_under_teacher_ken@gmail.com",
      };
      const errorMessage = { error: "Teacher input unavailable or invalid." };
      const { body: error } = await request(app)
        .post("/api/retrievefornotifications")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
    it("POST should throw error when mentions are unavailable", async () => {
      const expectedData = {
        teacher: "nicholas10@gmail.com",
        notification: "Hello students! @wrongStudent@gmail.com",
      };
      const errorMessage = { error: "Not all students mentioned are found." };
      const { body: error } = await request(app)
        .post("/api/retrievefornotifications")
        .send(expectedData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
  });
});
