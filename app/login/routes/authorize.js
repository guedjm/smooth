var express = require('express');
var router = express.Router();
var authorizeHandler = require('../auth/authorize');

router.get('', function(req, res, next) {
  if (req.query.response_type == undefined)
  {
    return next()
  }

  switch (req.query.response_type) {
    case 'code':
      return authorizeHandler.handleAuthorizationCodeGrant(req, res, next);
      break;

    default:
      return next();
  }
});

router.post('', function (req, res, next) {

  if (req.query.response_type == undefined) {
    return next()
  }

  switch (req.query.response_type) {
    case 'code':
      return authorizeHandler.handleAuthorizationCodeGrantConfirm(req, res, next);
      break;

    default:
      return next();
  }
});


module.exports = router;