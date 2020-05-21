const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({
    "0": "GET   /",
  });
});

module.exports = app;
