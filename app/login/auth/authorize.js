var authorizeRequestModel = require('../../../common/entity/auth/authorizationRequest.js');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode.js');
var clientModel = require('../../../common/entity/client.js');
var config = require('../../../config.js');
var querystring = require("querystring");

function handleAuthorizationCodeGrant(req, res, next) {
  //Check query
  if (req.query.client_id == undefined || req.query.scope == undefined || config.login_srv.scopes.indexOf(req.query.scope) == -1
    || req.query.redirect_uri == undefined)
  {
    return next();
  }

  //Log the request
  var userId = (req.session == undefined) ? null : req.session.userId;
  authorizeRequestModel.createAuthorizationRequest(req.query.response_type, req.query.client_id,
    req.query.redirect_uri, req.query.scope, req.query.state, userId, req.ip, function (err, request) {
      if (err) {
        return next();
      }
      else {
        //Get client
        clientModel.findOne({clientId: req.query.client_id, activated: true}, function (err, client) {
          if (err || client == undefined || client.redirectUris.indexOf(req.query.redirect_uri) == -1) {
            return next();
          }
          else {

            //If client not logged in, redirect on login page
            if (userId == null) {
              res.redirect('/login?' + querystring.stringify(req.query));
              res.end();
            }
            else{
              //Display authorize form
              res.render('authorize', {client_name: client.applicationName, scope: req.query.scope, request_id: request._id });
            }
          }
        });
      }
    });
}

function handleAuthorizationCodeGrantConfirm(req, res, next) {
  //Check query
  if (req.query.client_id == undefined || req.query.scope == undefined || config.login_srv.scopes.indexOf(req.query.scope) == -1
    || req.query.redirect_uri == undefined || req.body.request_id == undefined)
  {
    return next();
  }

  //Log the request
  var userId = (req.session == undefined) ? null : req.session.userId;

  //Get client
  clientModel.findOne({clientId: req.query.client_id, activated: true}, function (err, client) {
    if (err || client == undefined || client.redirectUris.indexOf(req.query.redirect_uri) == -1) {
      return next();
    }
    else {
      //If client not logged in, redirect on login page
      if (userId == null) {
        res.redirect('/login?' + querystring.stringify(req.query));
        res.end();
      }
      else {
        //Check request
        authorizeRequestModel.findOne({_id: req.body.request_id}, function (err, request) {
          if (err || request == undefined ||
            request.responseType != req.query.response_type ||
            request.clientId != client.clientId ||
            request.redirectUri != req.query.redirect_uri ||
            request.scope != req.query.scope ||
            request.userId != userId) {
            return next();
          }

          //Generate code
          authorizationCodeModel.createCodeFromRequest(request, userId, client._id, function (err, authorizationCode) {
            if (err || authorizationCode == undefined) {
              return next();
            }

            //redirect user back to the application
            var redirect_query = {
              code: authorizationCode.code
            };
            if (req.query.state != undefined) {
              redirect_query ['state'] = req.query.state;
            }
            res.redirect(req.query.redirect_uri + '?' + querystring.stringify(redirect_query));
            res.end();
          });
        });
      }
    }
  });
}

module.exports.handleAuthorizationCodeGrant = handleAuthorizationCodeGrant;
module.exports.handleAuthorizationCodeGrantConfirm = handleAuthorizationCodeGrantConfirm;