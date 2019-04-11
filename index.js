'use strict';

console.log('Moi');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.get('/', (req, res) => {
  res.send('HAHAHAHAHAH');
});
app.post('/', bodyParser.urlencoded({extended : true}),(req, res) => {
  console.log(req.body);
  res.send('POst: HEllo' + req.body.name);
});
app.post('/', bodyParser.urlencoded({extended : true}),(req, res) => {
  console.log(req.query);
  res.send('POst: HEllo' + req.query.name);
});

app.listen(3000);