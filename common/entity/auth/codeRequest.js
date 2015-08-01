var mongoose = require('mongoose');

var codeRequestSchemas = new mongoose.Schema({
  clientId: String,
  origin: String,
  scope: [],
  redirect_uri: String,
  state: String,
  date: Date
});

codeRequestSchemas.statics.createCodeRequest = function (clientId, origin, scope, redirect_uri, state, cb) {
  var now = new Date();
  codeRequestModel.create({
    clientId: clientId,
    origin: origin,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
    date: now
  }, cb);
};

var codeRequestModel = mongoose.model('CodeRequest', codeRequestSchemas);

module.exports = codeRequestModel;