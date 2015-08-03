var mongoose = require('mongoose');

var authorizationErrorSchema = new mongoose.Schema({
  requestId: {Type: mongoose.Schema.Type.ObjectId, ref: 'AuthorizationRequest'},
  userId: {Type: mongoose.Schema.Type.ObjectId},
  error: String
});

authorizationErrorSchema.statics.createFromRequest = function (authorizationRequest, userId, error, cb) {
  authorizationErrorModel.create({
    requestId: authorizationRequest._id,
    userId: userId,
    error: error
  }, cb);
};

var authorizationErrorModel = mongoose.model('AuthorizationError', authorizationErrorSchema);

module.exports = authorizationErrorModel;