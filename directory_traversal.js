const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
app.use(cors());
const basePath = path.join(os.homedir(), "Pictures");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/my-route", (req, res) => {
  const requestBody = req.body;
  console.log("requestBody: ", requestBody);

  res.send("GET request with request body received");
});

const isURLSafe = (inputPath) => {
  const normalize = path.normalize(inputPath);
  const canonicalPath = path.resolve("./", normalize);
  console.log("canonicalPath: ", canonicalPath);
  if (canonicalPath.startsWith(basePath)) return true;
  return false;
};

app.get("/check-file", (req, res) => {
  const { foldername, filename } = req.query;
  const filePath = path.join(basePath, foldername, filename);
  console.log("filePath: ", filePath);

  if (isURLSafe(filePath)) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send("File not found");
      } else {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.status(500).send("Error reading file");
          } else {
            res.status(200).send(data);
          }
        });
      }
    });
  } else {
    res.status(500).send("Access denied");
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
