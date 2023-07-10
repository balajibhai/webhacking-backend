const express = require("express");
const { exec } = require("child_process");
const connection = require("./database");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const isPhoneNumberValid = (input) => {
  const regex = /^[0-9]+$/;
  return regex.test(input);
};

app.post("/twoauth/", (req, res) => {
  const { phonenumber } = req.body;
  const command = "dig https://www.google.com?numbers=" + phonenumber;
  const Insert = `INSERT INTO phonenumbers (phone_number) VALUES ('${phonenumber}')`;

  if (isPhoneNumberValid(phonenumber)) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("error: ", error);
        return res.status(500).send({ message: "Error executing the command" });
      }
      if (stderr) {
        console.log("stderr: ", stderr);
        return res.status(500).send({ message: "Command execution error" });
      }

      connection.query(Insert, (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error inserting phonenumber" });
        }
      });

      return res.status(200).send({ message: `Command Output: ${stdout}` });
    });
  } else {
    return res.status(500).send({ message: "Phone number is not valid" });
  }
});

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
