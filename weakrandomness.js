const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const connection = require("./database");

app.use(express.json());
app.use(cors());

const hashPassword = (password) => {
  const saltRounds =
    "$2b$04$ui0Zre2YtRmY0Zz1rdIQeutWHXUnLff/ujyZMhc9AW4.3uREH36cW";
  return bcrypt.hash(password, saltRounds);
};

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const passwdHash = await hashPassword(password);
  const insertQuery = `insert into users (email, password) values (?, ?)`;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    connection.getConnection((getConnectionError, connectionQuery) => {
      if (getConnectionError) {
        console.log("Error", getConnectionError);
      } else {
        connectionQuery.query(
          insertQuery,
          [email, passwdHash],
          (insertErr, inserRes) => {
            if (insertErr) {
              console.log("Error inserting the record: ", insertErr);
            } else {
              console.log("Record inserted successfully", inserRes);
            }
          }
        );
        connectionQuery.release();
      }
    });

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while registering." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const selectPwdQuery = `select password from users where email=?`;
  const passwdHash = await hashPassword(password);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    connection.getConnection((getConnectionError, connectionQuery) => {
      if (getConnectionError) {
        console.log("Error", getConnectionError);
      } else {
        connectionQuery.query(
          selectPwdQuery,
          [email],
          (selectErr, selectRes) => {
            if (!selectErr && passwdHash === selectRes[0]?.password) {
              return res
                .status(200)
                .send({ message: "logged in successfully" });
            } else {
              return res
                .status(500)
                .send({ message: "password or email mismatch" });
            }
          }
        );
        connectionQuery.release();
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while logging in" });
  }
});
app.get("/resetpassword", (req, res) => {
  res.status(200).send({
    message: "Reset password link is this fjkanfanllqeqwejlqje",
  });
});

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
