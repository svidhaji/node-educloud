'use strict';
require('dotenv').config();
const express = require('express');
const fs      = require('fs');
const https   = require('https');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 12;
const myPlainPassword = 'test123';

bcrypt.hash(myPlainPassword, saltRounds, (err, hash) => {
  //Store hash in your password DB
  console.log(hash);
});

passport.use(new Strategy(
    (username, password, done) => {
      console.log(`login? ${username}`);
      //Normally, select * from users where username=?
      if(username != process.env.USR && password != process.env.PWD) {
        console.log('login failed');
        return done(null, false);
      }
      console.log('login ok');
      return done(null, {name: username});
    }
));
passport.serializeUser((user, done) => {
  console.log('session serialize');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('session deserialize');
  done(null, user);
});

app.use(require('serve-static')(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SEC, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

console.log('Alive we ride');

const sslkey  = fs.readFileSync(process.env.KEY);
const sslcert = fs.readFileSync(process.env.CERT);
const options = {
  key: sslkey,
  cert: sslcert
};

app.get('/', (req, res) => {
  console.log(req);
  if (req.secure) res.send('https :) and hello' + req.user.name);
  else res.send('hello not secure?');
});
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    });
app.post('/',
    (req, res) => {
      console.log(req.body);
      res.send('POST: Hello ' + req.body.name);
    });
app.get('/test', (req, res) => {
  console.log(req.query);
  res.send(`Hello ${req.query.name}!`);
});

app.listen(3000); //normal http traffic
https.createServer(options, app).listen(8000); //https traffic