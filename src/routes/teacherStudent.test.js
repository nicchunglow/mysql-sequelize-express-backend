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
    });
  });
});
