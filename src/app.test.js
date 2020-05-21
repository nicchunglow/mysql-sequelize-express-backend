const express = require("express");
const app = require("./app");
const request = require("supertest");

describe("/", () => {
  test("will display route details in json", async () => {
    const data = {
      "0": "GET   /",
    };
    const { body: response } = await request(app).get("/");
    expect(response).toMatchObject(data);
  });
});
