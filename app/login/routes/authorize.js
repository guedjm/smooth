var express = require('express');
var router = express.Router();
var uriUtils = require('../../../common/utils/uri');
var authorizeHandler = require('../auth/authorize');

router.get('/:param', function(req, res, next) {
  var paramObj = uriUtils.parseUri(req.params.param);

  if (paramObj.response_type == undefined)
  {
    return next()
  }

  switch (paramObj.response_type) {
    case 'code':
      return authorizeHandler.handleAuthorizationCodeGrant(req, res, next, paramObj, req.params.param);
      break;

    default:
      return next();
  }
});

router.post('/:param', function (req, res, next) {
  var paramObj = uriUtils.parseUri(req.params.param);

  if (paramObj.response_type == undefined) {
    return next()
  }

  switch (paramObj.response_type) {
    case 'code':
      return authorizeHandler.handleAuthorizationCodeGrantConfirm(req, res, next, paramObj, req.params.param);
      break;

    default:
      return next();
  }
});


module.exports = router;