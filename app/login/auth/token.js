var accessTokenErrorModel = require('../../../common/entity/auth/accessTokenError');
var authorizationCodeModel = require('../../../common/entity/auth/authorizationCode');
var accessModel = require('../../../common/entity/auth/access');

function handleTokenError(req, res, error) {
  //Log the error
  accessTokenErrorModel.createError(req.smoothRequest, error, function (err, row) {
  });

  res.status(400).send({error: error});
}

function handleTokenRequestByCode(req, res, next) {

  //Check query
  if (req.query.code == undefined || req.query.redirect_uri == undefined) {
    handleTokenError(req, res, 'invalid_request');
  }
  else {
    //Get code
    authorizationCodeModel.findOne({code: req.query.code, clientId: req.smoothClient._id}, function (err, code) {
      if (err || code == undefined) {
        handleTokenError(req, res, 'invalid_grant');
      }
      else {
        //Check if code has been used
        if (code.used) {
          handleTokenError(req, res, 'invalid_grant'); //TODO
        }
        else if (code.expirationDate < new Date()) {
          handleTokenError(req, res, 'invalid_grant'); //TODO
        }
        else if (code.accessId != undefined) {
          accessModel.findOne({_id: code.accessId}, function (err, access) {
            if (err || access == undefined) {
              handleTokenError(req, res, 'server_errror');
            }
            else {
              access.renewTokens(req.smoothRequest._id, function (accessToken, refreshToken) {
                var response = {
                  access_token: accessToken.token,
                  token_type: "bearer",
                  expire_in: "3600",
                  refresh_token: refreshToken.token
                };
                res.send(response);
              });
            }
          });
        }
        else {
          //Create access
          accessModel.createNewAccessFromCodeGrant(req.smoothRequest._id, code, function (err, access, accessToken, refreshToken) {
            if (err) {
              handleTokenError(req, res, 'server_error');
            }
            else {
              var response = {
                access_token: accessToken.token,
                token_type: "bearer",
                expire_in: "3600",
                refresh_token: refreshToken.token
              };

              //Send response
              res.send(response);
            }
          });
        }
      }
    });
  }
}

module.exports.handleTokenRequestByCode = handleTokenRequestByCode;
module.exports.handleTokenError = handleTokenError;