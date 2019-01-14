const convict = require('convict');
const winston = require('winston');
require('dotenv').config();

const config = convict({
  env: {
    doc: 'Ambiente de ejecución',
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Puerto de ejecución de la app',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
  db: {
    host: {
      doc: 'nombre/IP del host de la base de datos',
      format: '*',
      default: '',
      env: 'DB_HOST',
    },
    name: {
      doc: 'Nombre de la base de datos',
      format: String,
      default: 'bco_node_dev',
    },
  },
  bco_jwtPrivateKey: {
    doc: 'Llave privada para la generación de tokens',
    format: '*',
    default: '',
    env: 'BCO_JWTPRIVATEKEY',
  },
});

// Cargar y validar la configuración
const env = process.env.NODE_ENV;
config.loadFile(`./startup/config_files/${env}.json`);

config.validate({ allowed: 'strict' });

if (!config.get('bco_jwtPrivateKey')) {
  winston.error('Error Fatal: jwtPrivateKey no está definido');
  process.exit(1);
}
module.exports.config = config;
