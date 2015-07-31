var config = require('../../config.js');
var request = require('request');
var expect = require('chai').expect;
var url = 'http://' + config.db_srv.url + ':' + config.http.port + '/';


describe('/', function() {
  describe('GET', function() {
    it('should return a response 401', function (done) {
      request.get(url, function (err, res, body) {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });
  });
});