const mysql = require("mysql2");
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PWRD,
  database: process.env.DB
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;