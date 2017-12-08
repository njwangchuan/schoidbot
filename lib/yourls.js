var request = require('request');
var querystring = require('querystring');
var yourlsOptions = require('../config/yourls');

var params = {
  'username': yourlsOptions.username,
  'password': yourlsOptions.password,
  'format': 'json'
};

module.exports.shorturl = function(url, callback) {

  if (yourlsOptions.enabled) {
    params.action = 'shorturl';
    params.url = url;
    request.post(yourlsOptions.url + "?" + querystring.stringify(params), function(err, response, body) {
      if (err) {
        callback(err, null);
      } else {
        var resp = JSON.parse(body);
        if (resp.shorturl) {
          callback(null, resp.shorturl.replace('http://', ''));
        } else {
          callback('Yourls server error', null);
        }
      }
    });
  } else {
    callback(null, url);
  }

};
