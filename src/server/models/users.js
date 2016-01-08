
/**
 * Module dependencies.
 * @private
 */

var DatabaseConnection = require('../middlewares/dbconnector');

var connection = new DatabaseConnection();
connection.open();

/**
 * Module exports.
 * @public
 */

module.exports = Users;

function Users(_connection) {
  this.connection = _connection;
}

Users.prototype.submitUser = function(_params) {
  if (!_params || !_params.userID) {
    return;
  }
  var query = 'INSERT INTO Users (ID) VALUES (' + _params.userID + ')';
  return this.connection.run(query);
};
