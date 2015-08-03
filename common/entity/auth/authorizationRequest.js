var mongoose = require('mongoose');

var authorizationRequestSchema = new mongoose.Schema({
  responseType: String,
  clientId: {Type: mongoose.Schema.Type.ObjectId, ref: 'Client'},
  redirectUri: String,
  scope: [String],
  state: String,
  origin: String,
  date: Date
});

authorizationRequestSchema.statics.createAuthorizationRequest = function (responseType, clientId, redirectUri, scope, state, origin, cb) {
  var now = new Date();
  authorizationRequestModel.create({
    responseType: responseType,
    clientId: clientId,
    redirectUri: redirectUri,
    scope: scope,
    state: state,
    origin: origin,
    date: now
  }, cb);
};

var authorizationRequestModel = mongoose.model('AuthorizationRequest', authorizationRequestSchema);

module.exports = authorizationRequestModel;