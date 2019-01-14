const jwt = require('jsonwebtoken');
const { User } = require('./User');
const { config } = require('../../startup/config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('debe retornar un token JWT válido', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('bco_jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});
