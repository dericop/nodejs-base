const Joi = require('joi');
const mongoose = require('mongoose');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const { config } = require('../../startup/config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: Boolean,
});

// eslint-disable-next-line func-names
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('bco_jwtPrivateKey'),
  );
  return token;
};

const User = mongoose.model('User', userSchema);

const complexityOptions = {
  min: 8,
  max: 15,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
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
  const propsValidation = Joi.validate(user, schema);
  if (propsValidation.error) return propsValidation;

  return Joi.validate(user.password, new PasswordComplexity(complexityOptions));
}

exports.User = User;
exports.validate = validateUser;
