var express = require('express');
var router = express.Router();
var clientModel = require('../../../common/entity/client');

/* GET clients. */
router.get('', function(req, res, next) {
  var query = clientModel.find({});
  query.exec(function (err, client) {
    res.send(client);
  });
});


router.post('', function(req, res, next) {
  clientModel.create({'application_name': 'test'}, function(err, result) {
    if (err)
      console.log(err);

    console.log(result);
    res.send('Ok');
  });
});



module.exports = router;