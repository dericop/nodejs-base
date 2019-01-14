const { User } = require('../../../components/users/User');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('Auth middleware', () => {
  it('Debe llenar req.user con el payload de un JWT válido', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
