var vhost = require('vhost');
var express = require('express');
var http = require('http');

var log = require('debug')('smooth:log');
var err = require('debug')('smmoth:error');
var config = require('../config.js');


/**
 * Initialise database connection
 */

log('Connecting to database ...');
var mongoose = require('mongoose');
mongoose.connection.on('open', function() {
  log('Database connection success');
});
mongoose.connection.on('error', function(err) {
  err('Database onnection failed : ' + err);
  err('Stopping program .. ');
  process.exit(1);
});
mongoose.connect('mongodb://' + config.db.server + ':' + config.db.port + '/' + config.db.database);

/**
 * Initializing vhosts
 */
log('Initializing vhosts ...');
var app = express();
var login = require('../app/login/app');
var api = require('../app/api/app');
var db = require('../app/db/app');
app.use(vhost(config.login_srv.url, login));
app.use(vhost(config.api_srv.url, api));
app.use(vhost(config.db_srv.url, db));

var httpServer = http.createServer(app);
httpServer.on('error', onError);
httpServer.on('listening', onListening);
httpServer.listen(config.http.port);


function onListening()
{
  var addr = httpServer.address();
  log('Server started on port ' + addr.port);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = 'Port ' + config.http.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      err(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      err(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}