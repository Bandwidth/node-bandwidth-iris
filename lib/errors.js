var util = require("util");

function BandwidthError(code, message, httpStatus){
  this.code = code;
  this.message = message;
  this.httpStatus = httpStatus;
}

function BandwidthMultipleError(errors){
  this.errors = errors;
  this.message = (errors.length == 1)? errors[0].message: "Some errors are occurred";
}

util.inherits(BandwidthError, Error);
util.inherits(BandwidthMultipleError, Error);

module.exports = {
  BandwidthError: BandwidthError,
  BandwidthMultipleError: BandwidthMultipleError
};
