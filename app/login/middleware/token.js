var accessTokenRequestModel = require('../../../common/entity/auth/accessTokenRequest.js');
var clientModel = require('../../../common/entity/client');

function handleAccessTokenRequest(req, res, next) {

  //Log the request
  accessTokenRequestModel.createRequest(req.query.grant_type, req.query.code, req.query.username, req.query.password,
    req.query.scope, req.query.refreshToken, req.query.redirect_uri, req.query.client_id, req.get('Authorization'), req.ip,
    function (err, accessRequest) {

      req.smoothRequest = accessRequest;
      if (req.get('Authorization') == undefined) {
        next();
      }
      else {

        //Get client secret
        var clientSecret = req.get('Authorization').split(' ');
        if (clientSecret[0] != 'Basic' || clientSecret.length != 2) {
          next();
        }
        clientSecret = clientSecret[1];

        //Get client
        clientModel.findOne({clientId: req.query.client_id, clientSecret: clientSecret}, function (err, client) {
          if (err || client == undefined || client.redirectUris.indexOf(req.query.redirect_uri) == -1) {

          }
          else {
            req.smoothClient = client;
          }
          next();
        });
      }
    });
}

module.exports = handleAccessTokenRequest;