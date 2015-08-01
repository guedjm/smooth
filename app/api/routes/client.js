var express = require('express');
var router = express.Router();
var clientModel = require('../../../common/entity/client.js');

/* GET clients. */
router.get('', function(req, res, next) {
  var query = clientModel.find({});
  query.exec(function (err, client) {
    res.send(client);
  });
});


router.get('/:id', function(req, res, next) {
  var query = clientModel.find({clientId: req.params.id});
  query.exec(function (err, client) {
    if (client.length == 0)
      next(null);
    else
      res.send(client[0]);
  });
});


router.post('', function(req, res, next) {
  var datas = req.body;
  if (datas.developerId == undefined || datas.clientType == undefined || datas.applicationName == undefined ||
    datas.redirectUris == undefined || datas.grantTypes == undefined || datas.javascriptOrigins == undefined)
    return next(null);
  res.send(req.body);
  clientModel.createNewClient(datas.developerId, datas.clientType, datas.applicationName, datas.redirectUris, datas.grantTypes, datas.javascriptOrigins, function(err, result) {
    if (err)
      next(err);
    res.send(result);
  });
});



module.exports = router;