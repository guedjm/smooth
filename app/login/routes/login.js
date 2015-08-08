var express = require('express');
var userModel = require('../../../common/entity/user');
var router = express.Router();

/* GET home page. */
router.get('/:param', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect(301, '/authorize/' + req.params.param);
    res.end();
  }
  res.render('login', { title: 'smooth' });
});

router.post('/:param', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect(301, '/authorize/' + req.params.param);
  }
  else if (req.body.email == undefined || req.body.password == undefined)
  {
    return res.send('undefined');
  }

  userModel.getUserId(req.body.email, req.body.password, function(err, user) {
    if (err) {
      next(err);
    }
    else if (user != null) {
      req.session.userId = user._id;
      res.redirect(301, '/authorize/' + encodeURIComponent(req.params.param));
    }
    else {
      res.send(req.body);
    }
  });
});

module.exports = router;