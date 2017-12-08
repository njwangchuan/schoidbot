var config = require('../config.json');

var d = {
  "twitterStatus": "*/15 * * * *",
  "rssFeeds": "*/60 * * * *"
};

module.exports = config.schedule
  ? config.schedule
  : d;
