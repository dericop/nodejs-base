const express = require('express');
const authCtrl = require('./authController');

const router = express.Router();

// router.get('/', authCtrl.getOffers);
router.post('/', authCtrl.authenticate);
// router.put('/:id', authCtrl.updateOffer);
// router.delete('/:id', authCtrl.deleteOffer);

module.exports.routes = router;
