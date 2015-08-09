var accessTokenRequestModel = require('../../../common/entity/auth/accessTokenRequest');
var clientModel = require('../../../common/entity/client');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode');
var accessModel = require('../../../common/entity/auth/access');

function handleTokenRequestByCode(req, res, next) {

  //Check query
  if (req.query.code == undefined || req.query.redirect_uri == undefined || req.query.client_id == undefined
    || req.get('Authorization') == undefined) {
    return next();
  }

  console.log("Query ok");

  //Get client secret
  var clientSecret = req.get('Authorization').split(' ');
  if (clientSecret[0] != 'Basic' || clientSecret.length != 2) {
    return next();
  }
  clientSecret = clientSecret[1];

  console.log(clientSecret);

  //Log the request
  accessTokenRequestModel.createCodeGrant(req.query.code, req.query.redirect_uri, req.query.client_id, clientSecret, req.ip, function (err, request) {
    if (err) {
      console.log(err);
      return next();
    }

    console.log("Log Ok");
    //Get client
    clientModel.findOne({clientId: req.query.client_id, clientSecret: clientSecret}, function (err, client) {
      if (err || client == undefined || client.redirectUris.indexOf(req.query.redirect_uri) == -1) {
        return next();
      }

      console.log("Client ok");
      //Get code
      authorizationCodeModel.findOne({code: req.query.code, clientId: client._id}, function (err, code) {
        if (err || code == undefined) {
          return next();
        }


        console.log("Code OK");
        //Check if code has been used
        if (code.used) {
          return next(); //TODO
        }

        //Check if code is expired
        if (code.expirationDate < new Date()) {
          console.log("Code expire");
          return next(); //TODO
        }

        //Create access
        accessModel.createNewAccessFromCodeGrant(request._id, code, function (err, access, accessToken, refreshToken) {
          if (err) {
            return next();
          }

          var response = {
            access_token: accessToken.token,
            token_type: "bearer",
            expire_in: "3600",
            refresh_token: refreshToken.token
          };

          //Send response
          res.send(response);
        });

      });
    });

  });

}

module.exports.handleTokenRequestByCode = handleTokenRequestByCode;