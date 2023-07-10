const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mysql1!@",
  database: "vulnerable",
});

module.exports = connection;
