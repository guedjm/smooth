var mongoose = require('mongoose');

var accessTokenRequestSchema = new mongoose.Schema({
  grantType: String,
  code: String, // For Authorization Code Grant
  username: String, // For Resource Owner Password Credentials Grant
  password: String, // For Resource Owner Password Credentials Grant
  scope: String, // For Resource Owner Password Credentials Grant
  refreshToken: String, // For Refresh Token Grant
  redirect_uri: String,
  clientId: String,
  origin: String,
  date: Date
});

accessTokenRequestSchema.statics.createTokenRequest = function (clientId, origin, scope, redirect_uri, state, cb) {
  var now = new Date();
  accessTokenRequestModel.create({
    clientId: clientId,
    origin: origin,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    date: now
  }, cb);
};

var accessTokenRequestModel = mongoose.model('AccessTokenRequest', accessTokenRequestSchema);

module.exports = accessTokenRequestModel;