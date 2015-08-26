var clientModel = require('../../../common/entity/client');
var userModel = require('../../../common/entity/user');
var accessTokenModel = require('../../../common/entity/auth/accessToken');

function getRequestAuthInformation(req, res, next) {

  var clientId = req.query.client_id;
  var authorizationType = null;
  var authorizationSecret = null;

  if (req.get('Authorization') == undefined) {
    next();
  }
  else {
    var tmp = req.get('Authorization').split(' ');

    if (tmp.length != 2) {
      next();
    }
    else {
      authorizationType = tmp[0];
      authorizationSecret = tmp[1];

      switch (authorizationType) {
        case 'Basic':
          handleBasicAuth(clientId, authorizationSecret, function (err, client) {
            req.smoothClient = client;
            next();
          });
          break;

        case 'Bearer':
          handleBearerAuth(authorizationSecret, function (err, client, user, access) {
            req.smoothClient = client;
            req.smoothUser = user;
            req.smoothClientAccess = access;
            next();
          });
          break;

        default :
          next();
      }
    }
  }
}

function handleBasicAuth(clientId, clientSecret, cb) {
  if (clientId == undefined) {
    cb(true, undefined);
  }
  else {
    clientModel.findOne({clientId: clientId, clientSecret: clientSecret}, function (err, client) {
      cb(err, client);
    })
  }
}

function handleBearerAuth(accessToken, cb) {
  accessTokenModel.findOne({token: accessToken, usable: true, expirationDate: { $gt: new Date()}})
    .populate('accessId')
    .exec(function (err, accessToken) {
      if (err || accessToken == undefined) {
        cb(err, undefined, undefined, undefined);
      }
      else {
        clientModel.findOne({_id: accessToken.accessId.clientId}, function (err, client) {
          if (err || client == undefined) {
            cb(err, undefined, undefined, undefined);
          }
          else {
            userModel.findOne({_id: accessToken.accessId.userId}, function (err, user) {
              if (err || user == undefined) {
                cb(err, undefined, undefined, undefined);
              }
              else {
                cb(null, client, user, accessToken.accessId);
              }
            });
          }
        });
      }
    });
}


module.exports = getRequestAuthInformation;