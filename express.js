const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./database");

app.use(express.json());
app.use(cors());

const selectAll = "select * from emails";

app.get("/tshirt", (req, res) => {
  connection.query(selectAll, (error, results) => {
    if (error) {
      console.log("Error showing the data:", error);
    }
    res.status(200).send(results);
  });
});

const sql = "INSERT INTO emails (name, email) VALUES (?, ?)";

app.post("/tshirt/:id", (req, res) => {
  const { email, name } = req.body;
  console.log("name: ", name);
  console.log("email: ", email);
  if (!email) {
    res.status(418).send({ message: "no email is given" });
    return;
  }

  connection.query(sql, [email, name], (err, result) => {
    if (err) {
      console.error("Error inserting email:", err);
      res.status(500).send({ message: "Error inserting email" });
      return;
    }
    console.log("Email added successfully");

    res.send({
      tshirt: `Here is your ${email}`,
    });
  });
});

app.delete("/tshirt/delete", (req, res) => {
  const { email } = req.body;
  console.log("email: ", email);
  const selectParticular =
    "SELECT email FROM emails WHERE email = '" + email + "'";

  connection.query(selectParticular, (error, results) => {
    const response = {};
    for (i = 0; i < results?.length; i++) {
      response[`email${i + 1}`] = results[i].email;
    }
    if (error) {
      console.error("Error selecting email:", error);
      return res.status(500).json({ message: "Error deleting email" });
    }
    if (results?.length === 0) {
      return res.status(404).json({ message: "email not found" });
    }

    return res.status(200).json({
      message: `email unsubscribed and deleted successfully`,
      response,
    });
  });
});

app.listen(5000, () => {
  console.log("Listening to port 5000");
});
