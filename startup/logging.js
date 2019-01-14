// Logging y manejo de errores globales
require('express-async-errors');
const winston = require('winston');

module.exports = () => {
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    new winston.transports.Console({
      level: 'error',
      colorize: true,
      prettyPrint: true,
    }),
  );

  process.on('uncaughtException', (ex) => {
    throw ex;
  });

  // loggin de promesas no controladas
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({ format: winston.format.simple() }),
    );
  }
};
