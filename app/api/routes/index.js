var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var result = {
    client: req.smoothClient,
    user : req.smoothUser,
    access: req.smoothClientAccess,
    msg: 'Hello API !'
  };
  console.log('hello');
  res.send(result);
});


module.exports = router;