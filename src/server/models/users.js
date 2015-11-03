
/**
 * Module dependencies.
 * @private
 */

var DatabaseConnection = require("../middlewares/dbconnector");
var Q = require('q');

/**
 * Module exports.
 * @public
 */

module.exports = Users;

function Users()
{ 
	//get the full list
	// this.data = [];
};

/**
 * update.
 * save array from db
 */
 
// Users.prototype.update = function() {};

// Users.prototype.getUserByID = function( id ) {};

Users.prototype.submitUser = function( _params )
{
	var query = '',
		deferred = Q.defer();

	var query = "INSERT INTO Users (ID) VALUES (" + _params.userID + ")";

	DatabaseConnection.db.serialize(function() {
		DatabaseConnection.db.run(query, function( err ){
			deferred.resolve( err );
		});
	});

	//resolve the promise
	return deferred.promise;
};