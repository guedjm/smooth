var express = require('express');
var router = express.Router();

/* GET user page. */
router.get('/', function(req, res, next) {
  if (req.smoothUser != undefined) {
    res.send(req.smoothUser);
  }
  else {
    next();
  }
});


module.exports = router;