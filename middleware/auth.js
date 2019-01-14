const _ = require('lodash');
const jwt = require('jsonwebtoken');
const authErrors = require('../components/auth/authErrors');
const { config } = require('../startup/config');
const BcoError = require('../commons/bcoError');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) throw new BcoError(authErrors.UNAUTHORIZED_USER, 401);

  const token = _.replace(authHeader, 'Bearer', '').trim();
  if (!token) throw new BcoError(authErrors.UNAUTHORIZED_USER, 401);

  try {
    const decoded = jwt.verify(token, config.get('bco_jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (error) {
    throw new BcoError(authErrors.INVALID_TOKEN, 400);
  }
};
