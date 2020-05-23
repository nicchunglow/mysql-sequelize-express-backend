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
      const expectedUserData = {
        teacher: "teacherken@gmail.com",
        students: ["studentjon@example.com", "studenthon@example.com"],
      };
      const response = await request(app)
        .post("/api/register")
        .send(expectedUserData)
        .expect(204);
      expect(response).not.toMatchObject(expectedUserData);
    });
    it("POST should throw error if there are empty inputs", async () => {
      const expectedUserData = {
        teacher: "",
        students: ["studentjon@example.com", "studenthon@example.com"],
      };
      const errorMessage = { error: "Missing teacher or student input" };
      const { body: error } = await request(app)
        .post("/api/register")
        .send(expectedUserData)
        .expect(422);
      expect(error).toMatchObject(errorMessage);
    });
  });
  describe("/commonstudents", () => {
    it("GET UNMOCKED should get students registered to single teacher if there is only one teacher", async () => {
      const sampleTeacher = "teacher=nicholas10%40gmail.com";
      const sampleData = {
        students: [
          "studentdick@example.com",
          "studentharry@example.com",
          "studentjon@gmail.com",
          "solokia3@example.com",
          "student_only_under_teacher_ken@gmail.com",
        ],
      };
      const response = await request(app)
        .get(`/api/commonstudents?${sampleTeacher}`)
        .send()
        .expect(200);
      expect(response.body).toMatchObject(sampleData);
    });
    it("GET UNMOCKED should get students registered multiple teachers", async () => {
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
  });
});
