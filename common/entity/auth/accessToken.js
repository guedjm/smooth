var mongoose = require('mongoose');

var accessTokenSchema = new mongoose.Schema({
  requestId: String,
  accessId: String,
  grantType: String,
  token: String,
  usable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

