const express = require('express');
const offCtrl = require('./offersController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const validateObjectId = require('../../middleware/validateObjectId');

const router = express.Router();

router.get('/', offCtrl.getOffers);
router.get('/:id', validateObjectId, offCtrl.getOffer);
router.post('/', auth, offCtrl.createOffer);
router.put('/:id', [auth, validateObjectId], offCtrl.updateOffer);
router.delete('/:id', [auth, admin, validateObjectId], offCtrl.deleteOffer);

module.exports.routes = router;
