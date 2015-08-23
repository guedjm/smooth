var authorizeRequestModel = require('../../../common/entity/auth/authorizationRequest.js');
var clientModel = require('../../../common/entity/client.js');

function handleAuthorizationRequest(req, res, next) {
  req.smoothRedirectAllowed = false;
  req.smootUserId = (req.session == undefined) ? null : req.session.userId;

  //Log the request
  var userId = (req.session == undefined) ? null : req.session.userId;

  if (req.method == 'GET') {
    authorizeRequestModel.createAuthorizationRequest(req.query.response_type, req.query.client_id,
      req.query.redirect_uri, req.query.scope, req.query.state, userId, req.ip, function (errRequest, request) {
        req.smoothRequest = request;
      });
  }

  //If redirect uri or client_id not defined,
  if (req.query.redirect_uri == undefined || req.query.client_id == undefined) {
    next();
  }
  else {
    //GetClient
    clientModel.findOne({clientId: req.query.client_id, activated: true}, function (errClient, client) {
      if (errClient || client == undefined) {
        next();
      }
      else {
        req.smoothClient = client;
        req.smoothRedirectAllowed = client.redirectUris.indexOf(req.query.redirect_uri) != -1;
        req.smoothUserId = userId;
        return next();
      }
    });
  }
}

module.exports = handleAuthorizationRequest;