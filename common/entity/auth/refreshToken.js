var mongoose = require('mongoose');

var refreshTokenSchema = new mongoose.Schema({
  requestId: {Type: mongoose.Schema.Type.ObjectId, ref: 'AccessTokenRequest'},
  accessId: {Type: mongoose.Schema.Type.ObjectId, ref: 'Access'},
  token: String,
  used: Boolean,
  usable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

var refreshTokenModel = new mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = refreshTokenModel;