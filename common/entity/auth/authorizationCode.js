var config = require('../../../config.js');
var mongoose = require('mongoose');
var sha1 = require('sha1');

var authorizationCodeSchemas = new mongoose.Schema({
  requestId: {Type: mongoose.Schema.Type.ObjectId, ref: 'AuthorizationRequest'},
  clientId: {Type: mongoose.Schema.Type.ObjectId, ref: 'Client'},
  userId: {Type: mongoose.Schema.Type.ObjectId},
  code: String,
  scope: [],
  deliveryDate: Date,
  expirationDate: Date,
  used: Boolean,
  useDate: Date
});

authorizationCodeSchemas.statics.createCodeFromRequest = function (authorizationRequest, userId, cb) {
  var now = new Date();
  authorizationCodeModel.create({
    requestId: authorizationRequest._id,
    clientId: authorizationRequest.clientId,
    userId: userId,
    code: sha1(now.toDateString() + authorizationRequest.clientId + userId + userId),
    scope: authorizationRequest.scope,
    deliveryDate: now,
    expirationDate: new Date(now.getMinutes() + config.login_srv.access_code_duration),
    used: false,
    useDate: null
  }, cb);
};

var authorizationCodeModel = mongoose.model('AuthorizationCode', authorizationCodeSchemas);

module.exports = authorizationCodeModel;