var express = require('express');
var router = express.Router();
var authorizeHandler = require('../auth/authorize');

router.get('', function(req, res, next) {
  var supportedMethod = ['code'];

  //If arguments are missing
  if (req.smoothRedirectAllowed == false || req.query.response_type == undefined) {
    authorizeHandler.handleAuthorizationError(req, res, 'invalid_request', next);
  }
  else {

    //If the response_type method is not supported
    if (supportedMethod.indexOf(req.query.response_type) == -1) {
      authorizeHandler.handleAuthorizationError(req, res, 'unsupported_response_type', next);
    }
    //Else if the client is not allowed to use this method
    else if (req.smoothClient.grantTypes.indexOf(req.query.response_type) == -1) {
      authorizeHandler.handleAuthorizationError(req, res, 'unauthorized_client', next);
    }
    else {
      //Handle each response_type
      switch (req.query.response_type) {
        case 'code':
          return authorizeHandler.handleAuthorizationCodeGrant(req, res, next);
          break;

        default:
          authorizeHandler.handleAuthorizationError(req, res, 'unsupported_response_type', next);
      }
    }
  }
});

router.post('', function (req, res, next) {
  var supportedMethod = ['code'];

  //If arguments are missing
  if (req.smoothRedirectAllowed == false || req.query.response_type == undefined) {
    authorizeHandler.handleAuthorizationError(req, res, 'invalid_request', next);
  }
  else {
    //If the response_type method is not supported
    if (supportedMethod.indexOf(req.query.response_type) == -1) {
      authorizeHandler.handleAuthorizationError(req, res, 'unsupported_response_type', next);
    }
    //Else if the client is not allowed to use this method
    else if (req.smoothClient.grantTypes.indexOf(req.query.response_type) == -1) {
      authorizeHandler.handleAuthorizationError(req, res, 'unauthorized_client', next);
    }
    else {
      //Handle each response_type
      switch (req.query.response_type) {
        case 'code':
          return authorizeHandler.handleAuthorizationCodeGrantConfirm(req, res, next);
          break;

        default:
          authorizeHandler.handleAuthorizationError(req, res, 'unsupported_response_type', next);
      }
    }
  }
});


module.exports = router;