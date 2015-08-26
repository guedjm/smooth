var log = require('debug')('smooth:api:log');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

/**
 * Middleware
 */
var authMiddleware = require('./middleware/auth');

/**
 * Routes
 */
var index = require('./routes/index');
var client = require('./routes/client');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/**
 * Defining routes
 */
app.use('/', authMiddleware);
app.use('/', index);
app.use('/client', client);




// 404 error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

log('API server intialized');

module.exports = app;