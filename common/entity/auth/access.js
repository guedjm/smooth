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

accessSchema.renewTokens = function (requestId, cb) {
  accessTokenModel.findOne({_id: this.currentAccessTokenId}, function (err, oldAccessToken) {
    if (err || oldAccessToken == undefined) {
      cb(err, null, null);
    }
    else {
      oldAccessToken.condemn(function (err) {
        if (err) {
          cb(err, null, null);
        }
        else {
          accessTokenModel.createFromCode(requestId, oldAccessToken.accessId, function (err, accessToken) {
            if (err || accessToken == undefined) {
              cb(err, null, null);
            }
            else {
              refreshTokenModel.findOne({_id: this.currentRefreshTokenId}, function (err, oldRefreshToken) {
                if (err || oldRefreshToken == undefined) {
                  cb(err, null, null);
                }
                else {
                  refreshTokenModel.createNewRefreshToken(requestId, oldRefreshToken.accessId, function (err, refreshToken) {
                    if (err || refreshToken == undefined) {
                      cb(err, null, null);
                    }
                    else {
                      this.currentAccessTokenId = accessToken._id;
                      this.currentRefreshTokenId = refreshToken._id;
                      this.save(function (err) {
                        if (err) {
                          cb(err, null, null);
                        }
                        else {
                          cb(null, accessToken, refreshToken);
                        }
                      });
                    }
                  });
                }
              })
            }
          });
        }
      })
    }
  });
}
;

var accessModel = mongoose.model('Access', accessSchema);

module.exports = accessModel;