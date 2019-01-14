const BcoError = require('../commons/bcoError');
const userErrors = require('../components/users/usersErrors');

module.exports = (req, res, next) => {
  if (!req.user.isAdmin) throw new BcoError(userErrors.FORBIDDEN, 403);
  next();
};
