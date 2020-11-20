/**
 * Frontend react.js server start up script.
 */

// Load .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const proxy = require('http-proxy-middleware');


app.use(express.static(path.join(__dirname, 'build')));

app.use(proxy('/api', { target: "http://localhost:443"}));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(80);