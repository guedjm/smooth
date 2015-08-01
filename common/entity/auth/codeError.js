var mongoose = require('mongoose');

var codeErrorSchemas = new mongoose.Schema({
  requestId: String,
  userId: String,
  error: String,
  date: Date
});

codeErrorSchemas.statics.createFromRequest = function (codeRequest, userId, error, cb) {
  var now = new Date();
  codeErrorModel.create({
    requestId: codeRequest._id,
    userId: userId,
    error: error,
    date: now
  }, cb);
};

var codeErrorModel = mongoose.model('CodeError', codeErrorSchemas);

module.exports = codeErrorModel;