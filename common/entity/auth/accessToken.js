var mongoose = require('mongoose');

var accessTokenSchema = new mongoose.Schema({
  requestId: {Type: mongoose.Schema.Type.ObjectId, ref: 'AccessTokenRequest'},
  accessId: {Type: mongoose.Schema.Type.ObjectId, ref: 'Access'},
  grantType: String,
  token: String,
  usable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

var accessTokenModel = new mongoose.model('AccessToken', accessTokenSchema);

module.exports = accessTokenModel;
