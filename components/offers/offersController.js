const winston = require('winston');
const offerService = require('./offersService');
const { validate } = require('./Offer');
const { OFFER_NOT_FOUND } = require('./offersErrors');
const BcoError = require('../../commons/bcoError');

async function getOffers(req, res) {
  const pageNumber = req.body.pageNumber || 1;
  const pageSize = req.body.pageSize || 20;

  const offers = await offerService.getOffers(pageNumber, pageSize);
  winston.log('info', `Ofertas listadas ${offers}`);
  return res.send(offers);
}

async function getOffer(req, res) {
  const offer = await offerService.getOffer(req.params.id);
  if (!offer) throw new BcoError(OFFER_NOT_FOUND, 404);

  winston.log('info', `Detalle de oferta solicitado ${offer}`);
  res.send(offer);
}

async function createOffer(req, res) {
  const { error } = validate(req.body);
  if (error) throw new BcoError(error.details[0].message, 400);

  const offer = await offerService.createOffer(req.body);
  winston.log('info', `Oferta creada ${offer}`);
  return res.send(offer);
}

async function updateOffer(req, res) {
  const { error } = validate(req.body);
  if (error) throw new BcoError(error.details[0].message, 400);

  const offer = await offerService.updateOffer(req.params.id, req.body);
  if (!offer) {
    throw new BcoError(OFFER_NOT_FOUND, 404);
  }
  winston.log('info', `Oferta actualizada ${offer}`);
  return res.send(offer);
}

async function deleteOffer(req, res) {
  const offer = await offerService.removeOffer(req.params.id);
  if (!offer) {
    throw new BcoError(OFFER_NOT_FOUND, 404);
  }
  winston.log('info', `Oferta eliminada ${offer}`);
  return res.send(offer);
}

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getOffer,
};
