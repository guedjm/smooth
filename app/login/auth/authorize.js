var authorizeRequestModel = require('../../../common/entity/auth/authorizationRequest.js');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode.js');
var clientModel = require('../../../common/entity/client.js');
var config = require('../../../config.js');

function handleAuthorizationCodeGrant(req, res, next, param, paramStr) {
  //Check params
  if (param.client_id == undefined || param.scope == undefined || config.login_srv.scopes.indexOf(param.scope) == -1
    || param.redirect_uri == undefined)
  {
    return next();
  }

  //Log the request
  var userId = (req.session == undefined) ? null : req.session.userId;
  authorizeRequestModel.createAuthorizationRequest(param.response_type, param.client_id,
    param.redirect_uri, param.scope, param.state, userId, req.get('host'), function (err, request) {
      if (err) {
        return next();
      }
      else {
        //Get client
        clientModel.findOne({clientId: param.client_id, activated: true}, function (err, client) {
          if (err || client == undefined) {
            return next();
          }
          else {

            //If client not logged in, redirect on login page
            if (userId == null) {
              res.redirect(301, '/login/' + encodeURIComponent(paramStr));
              res.end();
            }
            else{
              //Display authorize form
              res.render('authorize', {client_name: client.applicationName, scope: param.scope, request_id: request._id });
            }
          }
        });
      }
    });
}

function handleAuthorizationCodeGrantConfirm(req, res, next, param, paramStr) {
  //Check params
  if (param.client_id == undefined || param.scope == undefined || config.login_srv.scopes.indexOf(param.scope) == -1
    || param.redirect_uri == undefined || req.body.request_id == undefined)
  {
    return next();
  }

  //Log the request
  var userId = (req.session == undefined) ? null : req.session.userId;

  //Get client
  clientModel.findOne({clientId: param.client_id, activated: true}, function (err, client) {
    if (err || client == undefined) {
      return next();
    }
    else {
      //If client not logged in, redirect on login page
      if (userId == null) {
        res.redirect(301, '/login/' + paramStr);
        res.end();
      }
      else {
        //Check request
        authorizeRequestModel.findOne({_id: req.body.request_id}, function (err, request) {
          if (err || request == undefined ||
            request.responseType != param.response_type ||
            request.clientId != client.clientId ||
            request.redirectUri != param.redirect_uri ||
            request.scope != param.scope ||
            request.userId != userId) {
            return next();
          }

          console.log(request._id);

          //Generate code
          authorizationCodeModel.createCodeFromRequest(request, userId, client._id, function (err, authorizationCode) {
            if (err || authorizationCode == undefined) {
              return next();
            }

            //redirect user back to the application
            var full_redirect_uri = param.redirect_uri + '?code=' + authorizationCode.code;
            if (param.state != undefined) {
              full_redirect_uri += '&state=' + param.state;
            }
            res.redirect(301, full_redirect_uri);
            res.end();
          });
        });
      }
    }
  });
}

module.exports.handleAuthorizationCodeGrant = handleAuthorizationCodeGrant;
module.exports.handleAuthorizationCodeGrantConfirm = handleAuthorizationCodeGrantConfirm;