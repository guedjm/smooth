var mongoose = require('mongoose');

var  accessSchema = new mongoose.Schema({
  clientId: {Type: mongoose.Schema.Type.ObjectId, ref: 'Client'},
  userId: mongoose.Schema.Type.ObjectId,
  scope: [String],
  currentAccessTokenId: {Type: mongoose.Schema.Type.ObjectId, ref: 'AccessToken'},
  currentRefreshTokenId: {Type: mongoose.Schema.Type.ObjectId, ref: 'RefreshToken'},
  deliveryDate: Date,
  revoked: Boolean
});

var accessModel = new mongoose.model('Access', accessSchema);

module.exports = accessModel;