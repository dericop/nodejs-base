const Joi = require('Joi');
const winston = require('winston');
const bcrypt = require('bcrypt');
const userService = require('../users/usersService');
const { INVALID_USER_OR_PASSWORD } = require('../users/usersErrors');
const BcoError = require('../../commons/bcoError');

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(3)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };
  return Joi.validate(req, schema);
}

async function authenticate(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await userService.findByEmail(req.body.email);
  if (!user) throw new BcoError(INVALID_USER_OR_PASSWORD, 400);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) throw new BcoError(INVALID_USER_OR_PASSWORD, 400);

  const token = user.generateAuthToken();
  winston.log('info', `Login Exitoso ${req.body.email}`);
  return res.send(token);
}

module.exports = {
  authenticate,
  validate,
};
