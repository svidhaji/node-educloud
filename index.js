'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

//Creating connection to database
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.get('/', (req, res) => {
  conn.query(
      'CREATE TABLE snake',
      (err, results, fields) => {
        console.log(results);
        console.log(fields);
      })
});

app.post('/', bodyParser.urlencoded({extended : true}),(req, res) => {
  console.log(req.body);
  res.send('POst: HEllo' + req.body.name);
});

app.listen(3000);
