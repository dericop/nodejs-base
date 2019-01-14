const winston = require('winston');
const express = require('express');

// Inicialización del servidor
const app = express();

// Cargar variables basado en el ambiente (dev, prod)
const { config } = require('./startup/config');
// Configuración logging
require('./startup/logging')();
// Cargar variables de entorno
require('dotenv').config();
// Configuración de routers
require('./startup/routes')(app);
// Inicialización de BD
require('./startup/db')();
// Configurar validaciones
require('./startup/validation')();

const server = app.listen(config.get('port'), () => {
  winston.log('info', `Escuchando en puerto ${config.get('port')}!`);
});

module.exports = server;
