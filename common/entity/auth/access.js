var mongoose = require('mongoose');
var accessTokenModel = require('./accessToken');
var refreshTokenModel = require('./refreshToken');

var  accessSchema = new mongoose.Schema({
  clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  userId: mongoose.Schema.Types.ObjectId,
  scope: String,
  currentAccessTokenId: {type: mongoose.Schema.Types.ObjectId, ref: 'AccessToken'},
  currentRefreshTokenId: {type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken'},
  deliveryDate: Date,
  revoked: Boolean
});

accessSchema.statics.createNewAccessFromCodeGrant = function (requestId, code, cb) {

  //Set Code as used
  code.useCode(function (err) {
    if (err) {
      return cb(err, null, null, null);
    }

    console.log("Code used");
    //Create access
    accessModel.create({
      clientId: code.clientId,
      userId: code.userId,
      scope: code.scope,
      currentAccessTokenId: null,
      currentRefreshTokenId: null,
      deliveryDate: new Date(),
      revoked: false
    }, function (err, access) {

      if (err) {
        return cb(err, null, null, null);
      }

      console.log('access created');
      //Create token
      accessTokenModel.createFromCode(requestId, access._id, function(err, token) {
        if (err) {
          return cb(err, null, null, null);
        }

        console.log('token created');
        //Create refresh token
        refreshTokenModel.createNewRefreshToken(requestId, access._id, function(err, refreshToken) {
          if (err) {
            return cb(err, null, null, null);
          }

          console.log("refresh token crated");
          //Update access
          access.currentAccessTokenId = token._id;
          access.currentRefreshTokenId = refreshToken._id;
          access.save(function(err) {
            if (err) {
              return cb(err, null, null, null);
            }
            console.log('access updated');

            //return
            return cb(null, access, token, refreshToken);
          });
        });
      });
    });
  });
};

var accessModel = mongoose.model('Access', accessSchema);

module.exports = accessModel;