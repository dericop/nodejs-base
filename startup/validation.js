const Joi = require('joi');
const joiObjectId = require('joi-objectid');

module.exports = () => {
  Joi.objectId = joiObjectId(Joi);
};
