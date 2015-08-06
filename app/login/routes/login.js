var express = require('express');
var userModel = require('../../../common/entity/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect(301, '/authorize');
    res.end();
  }
  res.render('login', { title: 'smooth' });
});

router.post('/', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect(301, '/authorize');
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
      console.log(user);
      req.session.userId = user._id;
      res.redirect(301, '/authorize');
    }
    else {
      res.send(req.body);
    }
  });
});

module.exports = router;