const _ = require('lodash');
const winston = require('winston');
const userService = require('./usersService');
const { validate } = require('./User');
const { USER_ALREADY_EXISTS } = require('./usersErrors');
const BcoError = require('../../commons/bcoError');

async function getUserInfo(req, res) {
  const user = await userService.findById(req.user._id).select('-password');
  res.send(user);
}

async function createUser(req, res) {
  const { error } = validate(req.body);
  if (error) throw new BcoError(error.details[0].message, 400);

  let user = await userService.findByEmail(req.body.email);
  if (user) throw new BcoError(USER_ALREADY_EXISTS, 400);

  user = await userService.createUser(req.body);
  winston.log('info', `Usuario creado ${user}`);
  return res.send(_.pick(user, ['_id', 'name', 'email']));
}

module.exports = {
  createUser,
  getUserInfo,
};
