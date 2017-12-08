var config = require('../config.json');

var d = {
  "normalize": true,
  "addmeta": false,
  "resume_saxerror": true
};

module.exports = config.feedparser
  ? config.feedparser
  : d;
