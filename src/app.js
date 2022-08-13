const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const error = require('./error');
const api = require('./api/getData');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello Home'
  });
});

app.use('/data', api);

app.use(error.notFound);
app.use(error.errorHandler);

module.exports = app;
