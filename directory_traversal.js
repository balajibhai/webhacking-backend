const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const basePath = path.join(__dirname, "../../../Pictures");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/my-route", (req, res) => {
  const requestBody = req.body;
  console.log("requestBody: ", requestBody);

  res.send("GET request with request body received");
});

app.get("/check-file", (req, res) => {
  const { foldername, filename } = req.query;
  const filePath = path.join(basePath, foldername, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.status(200).sendFile(filePath);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
