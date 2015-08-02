var mongoose = require('mongoose');

var refreshTokenSchema = new mongoose.Schema({
  requestId: String,
  accessId: String,
  token: String,
  used: Boolean,
  useable: Boolean,
  deliveryDate: Date,
  expirationDate: Date
});

