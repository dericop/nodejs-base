const express = require('express');
const usersCtrl = require('./usersController');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/me', auth, usersCtrl.getUserInfo);
router.post('/', usersCtrl.createUser);
// router.put('/:id', usersCtrl.updateOffer);
// router.delete('/:id', usersCtrl.deleteOffer);

module.exports.routes = router;
