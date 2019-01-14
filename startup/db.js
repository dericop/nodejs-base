const winston = require('winston');
const mongoose = require('mongoose');
const { config } = require('../startup/config');

module.exports = () => {
  mongoose
    .connect(
      `${config.get('db').host}/${config.get('db').name}`,
      { useNewUrlParser: true, useCreateIndex: true },
    )
    .then(() => winston.info(`Conectado a MongoDB - ${config.get('db').name}`));
};
