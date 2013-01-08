var util = require('util');

var RecordNotFoundError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
}
util.inherits(RecordNotFoundError, Error);
RecordNotFoundError.prototype.name = 'RecordNotFound Error';

module.exports = RecordNotFoundError;
