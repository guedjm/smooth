var express = require('express');
var router = express.Router();
var tokenHandler = require('../auth/token');

router.get('', function (req, res, next) {
  var supportedGrant = ['authorization_code'];

  if (supportedGrant.indexOf(req.query.grant_type) == -1) {
    tokenHandler.handleTokenError(req, res, 'unsupported_grant_type');
  }
  else if (req.smoothClient == undefined) {
    tokenHandler.handleTokenError(req, res, 'invalid_client');
  }
  else {
    switch (req.query.grant_type) {
      case 'authorization_code':
        tokenHandler.handleTokenRequestByCode(req, res, next);
        break;

      default:
        tokenHandler.handleTokenError(req, res, 'unsupported_grant_type');
    }
  }
});

module.exports = router;