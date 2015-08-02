var mongoose = require('mongoose');

var authorizationErrorSchema = new mongoose.Schema({
  requestId: String,
  userId: String,
  error: String
});

authorizationErrorSchema.statics.createFromRequest = function (codeRequest, userId, error, cb) {
  authorizationErrorModel.create({
    requestId: codeRequest._id,
    userId: userId,
    error: error
  }, cb);
};

var authorizationErrorModel = mongoose.model('AuthorizationError', authorizationErrorSchema);

module.exports = authorizationErrorModel;