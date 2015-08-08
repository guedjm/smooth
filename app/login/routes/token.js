var express = require('express');
var router = express.Router();
var tokenHandler = require('../auth/token');

router.get('', function (req, res, next) {
  if (req.query.grant_type == undefined) {
    return next();
  }

  switch (req.query.grant_type) {
    case 'authorization_code':
      tokenHandler.handleTokenRequestByCode(req, res, next);
      break;

    default:
      return next();
  }
});

module.exports = router;