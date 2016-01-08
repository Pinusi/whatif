
/**
 * Module dependencies.
 * @private
 */

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var Q = require('q');

/**
 * Module variables.
 * @private
 */

var db_file = path.join(__dirname, '../db/whatif.db');

/**
 * Module exports. (in this case as it is a variable and not a function declaration must be put after)
 * @public
 */

module.exports = DatabaseConnection;

function DatabaseConnection(_db_file) {
  this.db_location = _db_file ? _db_file : db_file;
};

DatabaseConnection.prototype.open = function() {
  var deferred = Q.defer();

  fs.exists(this.db_location, function(exists) {
    if (exists) {
      this.db = new sqlite3.Database(db_file);
      deferred.resolve();
    } else {
      deferred.reject('db not available');
    }
  }.bind(this));

  return deferred.promise;
};

DatabaseConnection.prototype.query = function(_query) {
  var deferred = Q.defer();
  var data = [];

  //request data from db
  this.db.serialize(function() {
    this.db.each(_query, function(err, row) {
      if (err) {
        deferred.reject(err);
      } else {
        data.push(row);
      }
    },
		function() {
  deferred.resolve(data);
		});
  }.bind(this));

  return deferred.promise;
};

DatabaseConnection.prototype.run = function(_query) {
  var deferred = Q.defer();
  var data = [];

  this.db.serialize(function() {
    this.db.run(_query, function(err) {
      deferred.resolve(err);
    });
  }.bind(this));

  return deferred.promise;
};

DatabaseConnection.prototype.close = function() {
  this.db.close();
};
