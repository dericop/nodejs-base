// Manejo de errores a nivel de request
const winston = require('winston');

module.exports = (err, req, res, next) => {
  winston.error(err.message, err);
  const jerror = { error: err.message };

  switch (err.code) {
    case 401:
      res.status(401).json(jerror);
      break;
    case 400:
      res.status(400).json(jerror);
      break;
    case 404:
      res.status(404).json(jerror);
      break;
    case 403:
      res.status(403).json(jerror);
      break;
    default:
      res.status(500).json(jerror);
      break;
  }

  next();
};
