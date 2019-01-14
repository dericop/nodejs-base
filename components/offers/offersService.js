const { Offer } = require('./Offer');

async function getOffers(pageNumber, pageSize) {
  const offers = await Offer.find()
    .skip((pageNumber - 1) * pageSize)
    .sort(Offer.date)
    .limit(pageSize);
  return offers;
}

async function createOffer(offerBody) {
  let offer = new Offer(offerBody);

  offer = await offer.save();
  return offer;
}

async function updateOffer(id, offer) {
  const result = await Offer.findByIdAndUpdate(id, offer, { new: true });
  return result;
}

async function removeOffer(id) {
  const result = await Offer.findByIdAndRemove({ _id: id });
  return result;
}

async function getOffer(id) {
  const result = await Offer.findById(id);
  return result;
}

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  removeOffer,
  getOffer,
};
