const mongoose = require('mongoose');
const BcoError = require('../commons/bcoError');
const { OFFER_INVALID } = require('../components/offers/offersErrors');

module.exports = (req, res, next) => {
  const isObjectIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isObjectIdValid) throw new BcoError(OFFER_INVALID, 404);

  next();
};
