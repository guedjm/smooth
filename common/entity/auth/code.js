var config = require('../../../config.js');
var mongoose = require('mongoose');
var sha1 = require('sha1');

var codeSchemas = new mongoose.Schema({
  requestId: String,
  clientId: String,
  userId: String,
  code: String,
  scope: [],
  deliveryDate: Date,
  expirationDate: Date,
  used: Boolean
});

codeSchemas.statics.createCodeFromRequest = function (codeRequest, userId, cb) {
  var now = new Date();
  codeModel.create({
    requestId: codeRequest._id,
    clientId: codeRequest.clientId,
    userId: userId,
    code: sha1(now.toDateString() + codeRequest.clientId + userId + userId),
    scope: codeRequest.scope,
    deliveryDate: now,
    expirationDate: new Date(now.getMinutes() + config.login_srv.access_code_duration),
    used: false
  }, cb);
};

var codeModel = mongoose.model('Code', codeSchemas);

module.exports = codeModel;