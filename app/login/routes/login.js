var express = require('express');
var userModel = require('../../../common/entity/user');
var router = express.Router();
var querystring = require("querystring");

/* GET home page. */
router.get('', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect('/authorize?' + querystring.stringify(req.query));
  }
  res.render('login', { title: 'smooth' });
});

router.post('', function(req, res, next) {
  var session = req.session;

  //If user is already logged, redirect to authorize
  if (session.userId !=  undefined)
  {
    res.redirect('/authorize?' + querystring.stringify(req.query));
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
      res.redirect('/authorize?' + querystring.stringify(req.query));
    }
    else {
      res.send(req.body);
    }
  });
});

module.exports = router;