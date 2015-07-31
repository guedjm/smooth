var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
  client_id: String,
  client_type: String,
  application_name: String,
  client_secret: String,
  redirect_uris: [],
  grant_types: [],
  javascript_origins: []
});

var clientModel = mongoose.model('Client', clientSchema);

module.exports = clientModel;