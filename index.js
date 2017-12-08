var ns = require('node-schedule');
var Twitter = require('twitter');
var FeedParser = require('feedparser');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var db = require('./lib/db_none_transational');
var yourls = require('./lib/yourls');

var feeds = require('./config/feeds');
var feedparserOptions = require('./config/feedparser');
var twitterOptions = require('./config/twitter');
var scheduleOptions = require('./config/schedule');
var twitterClient = new Twitter(twitterOptions);

var reg = /rss:.+/;

var parseFeed = function(feed, callback) {
  var req = request(feed.url);
  var feedparser = new FeedParser(feedparserOptions);
  req.on('error', function(err) {
    callback(err, null);
  });

  req.on('response', function(res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    } else {
      stream.pipe(feedparser);
    }
  });

  req.on('end', () => {
    callback(null, feed.url + ' parse done');
  });

  feedparser.on('error', function(error) {
    // always handle errors
  });

  feedparser.on('readable', function() {
    var stream = this;
    var item;
    while (item = stream.read()) {
      Object.keys(item).forEach((key) => {
        if (reg.test(key) || !item[key] || (Object.keys(item[key]).length === 0 && !(item[key] instanceof Date))) {
          delete item[key];
        }
      });
      delete item['pubDate'];
      item.hashTags = feed.hashTags.join(' ');
      db.insertIgnoreTable('rss_items', [item], function(err, result) {
        if (err) {
          console.log(err);
        } else {}
      });
    }
  });
};

var getItemPic = (link, callback) => {
  request.get(link, (err, response, body) => {
    if (err) {
      callback(err, null);
    } else {
      var $ = cheerio.load(body);
      var imgs = $('p > img').toArray();
      if (imgs.length) {
        callback(err, imgs[0].attribs.src);
      } else {
        callback(err, undefined);
      }
    }
  });
};

var uploadPicture = (src, callback) => {
  if (!src) {
    callback(null, undefined);
  } else {
    var options = {
      url: src,
      encoding: null,
      method: 'GET'
    };
    request(options, (err, response, buffer) => {
      if (err) {
        callback(err, null);
      } else {
        twitterClient.post('media/upload', {
          media: buffer
        }, callback);
      }
    });
  }
};

var updateTwitterStatus = function(callback) {
  var d = new Date();
  //只推送6小时内更新的feed
  d.setHours(d.getHours() - 6);
  db.query('select * from rss_items where pubdate >= FROM_UNIXTIME(?) and status = 0 order by RAND() limit 1', [d.getTime() / 1000], function(err, rows) {
    if (err || rows.length == 0) {
      callback(err, null);
    } else {
      var item = rows[0];
      yourls.shorturl(item.link, function(err, shorturl) {
        if (err) {
          callback(err, null);
        } else {
          var status = {
            status: item.title + ' ' + item.hashTags + ' ' + shorturl
          };
          //获取文章内的第一幅图片地址
          getItemPic(item.link, (err, src) => {
            if (err) {
              callback(err, null);
            } else {
              //上传图片到Twitter
              uploadPicture(src, (err, media, response) => {
                if (!err && media) {
                  status.media_ids = media.media_id_string;
                }
                //发推
                twitterClient.post('statuses/update', status, function(err, tweet, response) {
                  if (err) {
                    callback(err, null);
                  } else {
                    db.updateTable('rss_items', 'link', [
                      {
                        'link': item.link,
                        'shorturl': shorturl,
                        'status': 1
                      }
                    ], callback);
                  }
                });
              });
            }
          });
        }
      });
    }
  });
};

var updateRssFeedsJob = (callback) => {
  console.log('update rss feeds job begin');
  async.map(feeds, parseFeed, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log('update rss feeds job end');
    }
    if (callback && typeof callback === 'function') {
      callback(err, results);
    }
  });
};

var updateTwitterStatusJob = (callback) => {
  console.log('update twitter status job begin');
  updateTwitterStatus(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('update twitter status job end');
    }
    if (callback && typeof callback === 'function') {
      callback(err, result);
    }
  });
};

(() => {
  ns.scheduleJob(scheduleOptions.twitterStatus, updateTwitterStatusJob);
  ns.scheduleJob(scheduleOptions.rssFeeds, updateRssFeedsJob);
  // updateTwitterStatusJob((err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(result);
  //   }
  // });
  console.log('gaari rss schedule start.');
})();
