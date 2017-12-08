var config = require('../config.json');

var d = {
  "enabled": false,
  "url": "http://yourls.com/yourls-api.php",
  "username": "yourlsusername",
  "password": "yourlspassword"
};

module.exports = config.yourls
  ? config.yourls
  : d;
