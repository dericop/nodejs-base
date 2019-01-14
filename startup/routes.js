const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const error = require('../middleware/error');
const offComponent = require('../components/offers');
const usersComponent = require('../components/users');
const authComponent = require('../components/auth');

module.exports = (app) => {
  // Configuración de middlewares
  app.use(express.json());
  app.use(helmet());

  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));

  // Configuración componentes
  app.use('/api/offers', offComponent.routes);
  app.use('/api/users', usersComponent.routes);
  app.use('/api/auth', authComponent.routes);
  app.use(error);
};
