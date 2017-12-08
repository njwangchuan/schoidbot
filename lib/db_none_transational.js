var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/db');
var delString = require('./delString');

var pool = mysql.createPool(dbconfig);

var insert = function(item, callback) {
  pool.query('INSERT INTO ' + this.tableName + ' SET ?', item, callback);
};

var insertIgnore = function(item, callback) {
  pool.query('INSERT IGNORE INTO ' + this.tableName + ' SET ?', item, callback);
};

var update = function(item, callback) {
  var updateKey = this.updateKey;
  pool.query('UPDATE ' + this.tableName + ' SET ? WHERE ' + updateKey + ' = ?', [
    item, item[updateKey]
  ], callback);
};

var replace = function(item, callback) {
  pool.query('REPLACE INTO ' + this.tableName + ' SET ?', item, callback);
};

var del = function(item, callback) {
  pool.query('DELETE FROM ' + this.tableName + ' WHERE ' + delString.escape(item), callback);
};

var duplicate = function(exampleItem, callback) {
  pool.query('REPLACE INTO ' + this.targetTableName + ' SELECT * FROM ' + this.srcTableName + ' WHERE ' + delString.escape(exampleItem), callback);
};

module.exports.query = function(sqlString, values, callback) {
  pool.query(sqlString, values, callback);
};

module.exports.truncateTable = function(tableName, callback) {
  pool.query('TRUNCATE TABLE ' + tableName, callback);
};

module.exports.syncTable = function(tableName, items, callback) {
  pool.query('TRUNCATE TABLE ' + tableName, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      async.map(items, insert.bind({tableName: tableName}), function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          var result = {
            message: tableName + ' list sync done',
            items: items
          };
          callback(null, result);
        }
      });
    }
  });
};

module.exports.updateTable = function(tableName, updateKey, items, callback) {
  async.map(items, update.bind({tableName: tableName, updateKey: updateKey}), function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      var result = {
        message: tableName + ' updated done',
        items: items
      };
      callback(null, result);
    }
  });
};

module.exports.delTable = function(tableName, items, callback) {
  async.map(items, del.bind({tableName: tableName}), function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, tableName + ' del done');
    }
  });
};

module.exports.replaceTable = function(tableName, items, callback) {
  async.map(items, replace.bind({tableName: tableName}), function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      var result = {
        message: tableName + ' replaced done',
        items: items
      };
      callback(null, result);
    }
  });
};

module.exports.insertIgnoreTable = function(tableName, items, callback) {
  async.map(items, insertIgnore.bind({tableName: tableName}), function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      var result = {
        message: tableName + ' insert(ignore) done',
        items: items
      };
      callback(null, result);
    }
  });
};

module.exports.moveTable = function(srcTableName, targetTableName, exampleItems, callback) {
  async.map(exampleItems, duplicate.bind({srcTableName: srcTableName, targetTableName: targetTableName}), function(err, results) {
    if (err) {
      callback(err, null);
    } else {
      async.map(exampleItems, del.bind({tableName: srcTableName}), function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          var result = {
            message: 'move item from ' + srcTableName + ' to ' + targetTableName + ' done',
            exampleItems: exampleItems
          };
          callback(null, result);
        }
      });
    }
  });
};
