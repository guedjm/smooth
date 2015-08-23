var accessModel = require('../../../common/entity/auth/access');
var authorizeErrorModel = require('../../../common/entity/auth/authorizationError.js');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode.js');
var authorizeRequestModel = require('../../../common/entity/auth/authorizationRequest.js');
var config = require('../../../config.js');
var querystring = require('querystring');

function handleAuthorizationError(req, res, error, next) {

  authorizeErrorModel.createFromRequest(req.smoothRequest, req.smoothUserId, error, function(err, row) {
  });

  if (req.smoothRedirectAllowed == false) {
    next();
  }
  else {
    var errorQuerry = {error: error};
    if (req.query.state != undefined) {
      errorQuerry.state = req.query.state;
    }
    res.redirect(req.query.redirect_uri + '?' + querystring.stringify(errorQuerry));
  }
}

function handleAuthorizationCodeGrant(req, res, next) {

  //Check query
  if (req.query.scope == undefined || config.login_srv.scopes.indexOf(req.query.scope) == -1) {
    handleAuthorizationError(req, res, 'invalid_request', next);
  }
  else if (req.smoothUserId == null) {
    //If user not logged in, redirect on login page
    res.redirect('/login?' + querystring.stringify(req.query));
  }
  else {
    accessModel.findOne({clientId: req.smoothClient._id,
      userId: req.smoothUserId,
      scope: req.query.scope}, function (err, access) {

      if (access != undefined) {

        //If access already exist, auto-authorize
        authorizationCodeModel.createCodeFromRequest(req.smoothRequest, req.smoothUserId, req.smoothClient._id, access, function (err, authorizationCode) {
          if (err || authorizationCode == undefined) {
            handleAuthorizationError(req, res, 'server_error', next);
          }
          else {
            //redirect user back to the application
            var redirect_query = {
              code: authorizationCode.code
            };
            if (req.query.state != undefined) {
              redirect_query.state = req.query.state;
            }
            res.redirect(req.query.redirect_uri + '?' + querystring.stringify(redirect_query));
          }
        });
      }
      else {
        //Display authorize form
        res.render('authorize', {
          client_name: req.smoothClient.applicationName,
          scope: req.query.scope,
          request_id: req.smoothRequest._id
        });
      }
    });
  }
}

function handleAuthorizationCodeGrantConfirm(req, res, next) {
  //Check query
  if (req.query.scope == undefined || config.login_srv.scopes.indexOf(req.query.scope) == -1 || req.body.request_id == undefined) {

    handleAuthorizationError(req, res, 'invalid_request', next);
  }
  else if (req.smoothUserId == null) {

    //If client not logged in, redirect on login page
    res.redirect('/login?' + querystring.stringify(req.query));
  }
  else {

    //Check request
    authorizeRequestModel.findOne({_id: req.body.request_id}, function (err, request) {
      if (err || request == undefined ||
        request.responseType != req.query.response_type ||
        request.clientId != req.smoothClient.clientId ||
        request.redirectUri != req.query.redirect_uri ||
        request.scope != req.query.scope ||
        request.userId != req.smoothUserId) {
        handleAuthorizationError(req, res, 'invalid_request', next);
      }
      else {
        //Generate code
        authorizationCodeModel.createCodeFromRequest(request, req.smoothUserId, req.smoothClient._id, null, function (err, authorizationCode) {
          if (err || authorizationCode == undefined) {
            handleAuthorizationError(req, res, 'server_error', next);
          }
          else {
            //redirect user back to the application
            var redirect_query = {
              code: authorizationCode.code
            };
            if (req.query.state != undefined) {
              redirect_query.state = req.query.state;
            }
            res.redirect(req.query.redirect_uri + '?' + querystring.stringify(redirect_query));
          }
        });
      }
    });
  }
}

module.exports.handleAuthorizationCodeGrant = handleAuthorizationCodeGrant;
module.exports.handleAuthorizationCodeGrantConfirm = handleAuthorizationCodeGrantConfirm;
module.exports.handleAuthorizationError = handleAuthorizationError;