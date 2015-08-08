var log = require('debug')('smooth:login:log');
var config = require('../../config');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

/**
 * Routes
 */
var index = require('./routes/index');
var login = require('./routes/login');
var authorize = require('./routes/authorize');

app.set('views', './app/login/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(session({secret: config.login_srv.session_secret, resave: true, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * Defining routes
 */
app.use('/', index);
app.use('/login', login);
app.use('/authorize', authorize);


// 404 error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handler
//Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

log('Auth server intialized');

module.exports = app;