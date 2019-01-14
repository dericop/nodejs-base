const mongoose = require('mongoose');
const Joi = require('joi');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 150,
  },
  address: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  budget: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  dueDate: { type: Date, default: Date.now },
  state: {
    type: String,
    default: 'abierto',
    enum: ['abierto', 'asignado', 'completado'],
  },
});

const Offer = mongoose.model('Offer', offerSchema);

function validateOffer(offer) {
  const schema = {
    offerId: Joi.objectId(),
    title: Joi.string()
      .min(10)
      .max(100)
      .required(),
    address: Joi.string().required(),
    details: Joi.string()
      .max(1000)
      .required(),
    budget: Joi.number().required(),
    author: Joi.string().required(),
    isPublished: Joi.bool(),
    dueDate: Joi.date(),
    state: Joi.string().valid('abierto', 'asignado', 'completado'),
  };

  return Joi.validate(offer, schema);
}

exports.Offer = Offer;
exports.validate = validateOffer;
