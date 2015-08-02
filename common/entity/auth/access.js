var mongoose = require('mongoose');

var  accessSchema = new mongoose.Schema({
  clientId: String,
  userId: String,
  scope: [],
  currentAccessTokenId: String,
  currentRefreshTokenId: String,
  deliveryDate: Date,
  revoked: Boolean
});