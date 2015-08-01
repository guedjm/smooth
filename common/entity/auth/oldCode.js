var mongoose = require('mongoose');

var oldCodeSchemas = new mongoose.Schema({
  requestId: String,
  clientId: String,
  userId: String,
  code: String,
  scope: [],
  deliveryDate: Date,
  expirationDate: Date,
  used: Boolean
});

oldCodeSchemas.statics.archiveCode = function (codeModel, cb) {
  oldCodeModel.create({
    requestId: codeModel.requestId,
    clientId: codeModel.clientId,
    userId: codeModel.userId,
    code: codeModel.code,
    scope: codeModel.scope,
    deliveryDate: codeModel.deliveryDate,
    expirationDate: codeModel.expirationDate,
    used: codeModel.used
  }, cb);
};

var oldCodeModel = mongoose.model('OldCode', oldCodeSchemas);

module.exports = oldCodeModel;