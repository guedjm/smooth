var mongoose = require('mongoose');

var authorizationRequestSchema = new mongoose.Schema({
  response_type: String,
  clientId: String,
  redirect_uri: String,
  scope: [],
  state: String,
  origin: String,
  date: Date
});

authorizationRequestSchema.statics.createAuthorizationRequest = function (clientId, origin, scope, redirect_uri, state, cb) {
  var now = new Date();
  authorizationRequestModel.create({
    clientId: clientId,
    origin: origin,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    date: now
  }, cb);
};

var authorizationRequestModel = mongoose.model('AuthorizationRequest', authorizationRequestSchema);

module.exports = authorizationRequestModel;