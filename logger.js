const EventEmitter = require("events");
const uuid = require("uuid");

class Logger extends EventEmitter {
  log(msg) {
    this.emit("message", { id: uuid.v4(), msg });
  }
}

// module.exports = Logger;

const Logger = require("./logger");
const path = require("path");
const fs = require("fs");

const logger = new Logger();
logger.on("message", (data) => {
  console.log("data: ", data);
});

logger.log("pass message");

const logFilePath = path.join(__dirname, "log.txt");
const logMessage = "This is a log message.";

fs.appendFile(logFilePath, logMessage + "\n", (err) => {
  if (err) {
    console.error("Error appending to log file:", err);
  } else {
    console.log("Log message appended to file!");
  }
});
