var mongoose = require('mongoose');

var authorizationErrorSchema = new mongoose.Schema({
  requestId: {type: mongoose.Schema.Types.ObjectId, ref: 'AuthorizationRequest'},
  userId: {type: mongoose.Schema.Types.ObjectId},
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