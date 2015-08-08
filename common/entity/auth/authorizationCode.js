var config = require('../../../config.js');
var mongoose = require('mongoose');
var sha1 = require('sha1');

var authorizationCodeSchemas = new mongoose.Schema({
  requestId: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthorizationRequest'},
  clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  code: String,
  scope: String,
  deliveryDate: Date,
  expirationDate: Date,
  used: Boolean,
  useDate: Date
});

authorizationCodeSchemas.statics.createCodeFromRequest = function (authorizationRequest, userId, clientId, cb) {
  var now = new Date();
  var expirationDate = new Date();
  expirationDate.setMinutes(now.getMinutes() + config.login_srv.access_code_duration);
  authorizationCodeModel.create({
    requestId: authorizationRequest._id,
    clientId: clientId,
    userId: userId,
    code: sha1(now.toString() + authorizationRequest.clientId + userId + userId),
    scope: authorizationRequest.scope,
    deliveryDate: now,
    expirationDate: expirationDate,
    used: false,
    useDate: null
  }, cb);
};

var authorizationCodeModel = mongoose.model('AuthorizationCode', authorizationCodeSchemas);

module.exports = authorizationCodeModel;