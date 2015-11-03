
/**
 * Module dependencies.
 * @private
 */

var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var path = require('path');

/**
 * Module variables.
 * @private
 */

var db_file = path.join(__dirname, '../db/whatif.db');

function DatabaseConnection()
{ 
	this.open();
};

DatabaseConnection.prototype.open = function()
{
	var that = this;

	fs.exists( db_file, function( exists )
	{
		if ( exists )
		{
			that.db = new sqlite3.Database( db_file );
		}
		else
		{
			console.log( "db not available" );
		}
	});
};

DatabaseConnection.prototype.close = function()
{
	this.db.close();
};

/**
 * Singleton connection
 */

var connection = new DatabaseConnection();

/**
 * Module exports. (in this case as it is a variable and not a function declaration must be put after)
 * @public
 */

module.exports = connection;