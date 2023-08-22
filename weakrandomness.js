const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const connection = require("./database");

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const insertQuery = `insert into users (email, password) values (?, ?)`;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const saltRounds = 2;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hashedPassword: ", hashedPassword);
    connection.query(insertQuery, [email, password], (insertErr, inserRes) => {
      connection.end();
      if (insertErr) {
        console.log("Error inserting the record: ", insertErr);
      } else {
        console.log("Record inserted successfully", inserRes);
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

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
