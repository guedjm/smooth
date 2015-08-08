var clientModel = require('../../../common/entity/client');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode');

function handleTokenRequestByCode(req, res, next) {

  //Check query
  if (req.query.code == undefined || req.query.redirect_uri == undefined || req.query.client_id == undefined
    || req.get('Authorization') == undefined) {
    return next();
  }

  //Get client
  var clientSecret = req.get('Authorization').split(' ');
  if (clientSecret[0] != 'Basic' || clientSecret.length != 2) {
    return next();
  }
  clientSecret = clientSecret[1];
  clientModel.findOne({clientId: req.query.client_id, clientSecret: clientSecret}, function (err, client) {
    if (err || client == undefined || client.redirectUris.indexOf(req.query.redirect_uri) == -1) {
      return next();
    }

    //Get code
    authorizationCodeModel.findOne({code: req.query.code, clientId: client._id}, function (err, code) {
      if (err || code == undefined) {
        return next();
      }

      //Check if code has been used
      if (code.used) {
        return next(); //TODO
      }

      //Check if code is expired
      if (code.expirationDate < new Date()) {
        return next(); //TODO
      }

      //Set Code as used

      //Create access

      //Create token

      //Create refresh token

      //Reply
    });
  });
}

module.exports.handleTokenRequestByCode = handleTokenRequestByCode;