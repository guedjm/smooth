var log = require('debug')('smooth:login:log');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

/**
 * Routes
 */
var index = require('./routes/index');
var login = require('./routes/login');

app.set('views', './app/login/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/**
 * Defining routes
 */
app.use('/', index);
app.use('/login', login);



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