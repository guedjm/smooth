var config = require('../../config.js');
var request = require('request');
var expect = require('chai').expect;
var url = 'http://' + config.login_srv.url + ':' + config.http.port + '/';


describe('/', function() {
  describe('GET', function() {
    it('should return a response 200', function (done) {
      request.get(url, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should have "Hello Auth server !" body', function (done) {
      request.get(url, function (err, res, body) {
        expect(res.body).to.equal('Hello Auth server !');
        done();
      });
    });
  });
});