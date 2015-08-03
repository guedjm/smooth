var mongoose = require('mongoose');

var accessTokenErrorSchema = new mongoose.Schema({
  requestId: {Type: mongoose.Schema.Type.ObjectId, ref: 'TokenRequest'},
  userId: {Type: mongoose.Schema.Type.ObjectId},
  error: String
});

var accessTokenErrorModel = mongoose.model('AccessTokenError', accessTokenErrorSchema);

module.exports = accessTokenErrorModel;