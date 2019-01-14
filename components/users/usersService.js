const bCrypt = require('bcrypt');
const { User } = require('./User');

async function findByEmail(emailB) {
  const user = await User.findOne({ email: emailB });
  return user;
}

async function findById(userid) {
  const user = await User.findById(userid);
  return user;
}

async function createUser(userBody) {
  let user = new User(userBody);
  const salt = await bCrypt.genSalt(10);
  user.password = await bCrypt.hash(user.password, salt);
  user = await user.save();
  return user;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
