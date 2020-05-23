const request = require("supertest");
const app = require("../app");
const express = require("express");

describe("/api", () => {
  afterEach(async () => {
    await jest.resetAllMocks();
  });
  describe("/register", () => {
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
  });
});
