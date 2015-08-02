var mongoose = require('mongoose');

var accessTokenErrorSchema = new mongoose.Schema({
  requestId: String,
  userId: String,
  error: String
});

accessTokenErrorSchema.statics.createFromRequest = function (codeRequest, userId, error, cb) {
  accessTokenErrorModel.create({
    requestId: codeRequest._id,
    userId: userId,
    error: error
  }, cb);
};

var accessTokenErrorModel = mongoose.model('AccessTokenError', accessTokenErrorSchema);

module.exports = accessTokenErrorModel;