function BcoError(message, code) {
  this.message = message;
  this.code = code;
  this.stack = new Error().stack;
}

BcoError.prototype = Object.create(Error.prototype);
BcoError.prototype.constructor = BcoError;

module.exports = BcoError;
