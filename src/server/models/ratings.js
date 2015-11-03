
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

module.exports = Ratings;

function Ratings()
{ 
	//get the full list
	this.data = [];
};

/**
 * update.
 * save array from db
 */
Ratings.prototype.update = function()
{
	var query = '',
		deferred = Q.defer();

	this.data = [];

	DatabaseConnection.db.serialize(function() {
		DatabaseConnection.db.each("SELECT * FROM UserIdeaRatings", function( err, row )
		{
			this.data.push( row );
		}, deferred.resolve );
	});

	//resolve the promise
	return deferred.promise;
};

/**
 * getAllRatingsGroupedByIdeaID.
 * return @Object = { IdeaID: SumRating }
 */
 
Ratings.prototype.getAllRatingsGroupedByIdeaID = function()
{
	var ratings_by_ideaid = {};
	
	this.update();

	for (var i = 0; i < this.data.length; i++) {
		if( !ratings_by_ideaid[ this.data[i].IdeaID ] )
		{
			ratings_by_ideaid[ this.data[i].IdeaID ] = this.data[i].Rating;
		}
		else
		{
			ratings_by_ideaid[ this.data[i].IdeaID ] += this.data[i].Rating;
		}
	};

	return ratings_by_ideaid;
};

// Ratings.prototype.getRatingsByPersonID = function( id ) {};

Ratings.prototype.submitRating = function( _params )
{
	var query = '',
		deferred = Q.defer(),
		date = new Date().getTime();

	var query = "INSERT INTO UserIdeaRatings (UserID, IdeaID, Rating, Date) VALUES ('" + _params.username + "', " + _params.ideaId + ", " + _params.rating + ", " + date + ")";

	DatabaseConnection.db.serialize(function() {
		DatabaseConnection.db.run(query, function( err ){
			deferred.resolve( err );
		});
	});

	//resolve the promise
	return deferred.promise;
};





