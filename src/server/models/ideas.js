
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

module.exports = Ideas;

function Ideas()
{ 
	//get the full list
	this.data = [];
	this.page = [];
};

/**
 * update.
 * save array from db
 * @order: nothing ( as they get ), latest ( ordered by date )
 */

Ideas.prototype.update = function( _order )
{
	var query = '',
		deferred = Q.defer();

	//clean data
	this.data = [];

	//query
	switch( _order )
	{
		case 'latest':
			query = "SELECT * FROM Ideas ORDER BY Date";
			break;

		default:
			query = "SELECT * FROM Ideas";
	};

	//request data from db
	DatabaseConnection.db.serialize(function() {
		DatabaseConnection.db.each( query, function( err, row )
		{
			that.data.push( row );
		}, deferred.resolve );
	});

	//resolve the promise
	return deferred.promise;
};

/**
 * getIdeas.
 * get a list of ideas sorted and paginated
 * @params: idea_per_page, page, sorting
 */

Ideas.prototype.getIdeas = function( _params )
{
	var deferred = Q.defer();

	//update and paginate
	this.update( _params.sorting )
		.then(function(){

			//paginate
			var page = this.paginate( _params.idea_per_page, _params.page );

			//solve the promise
			deferred.resolve( page );

		}.bind(this));

	return deferred.promise;
};


/**
 * getIdeaByID.
 * return @Object = { ID: id,  }
 */

Ideas.prototype.getIdeaByID = function( _id )
{
	var deferred = Q.defer();

	//update and paginate
	this.update()
		.then(function(){
			var idea = this.findIdea( _id );

			//solve the promise
			deferred.resolve( idea );

		}.bind(this));

	return deferred.promise;
};

/**
 * paginate.
 * paginate the ideas and put them into page variable
 */

Ideas.prototype.paginate = function( _perpage, _page )
{
	//clean page
	var page = [];

	//starting point
	var starting_idea = _perpage * _page;

	//save ideas in the page
	for ( var i = starting_idea; i < _perpage; i++ ) 
	{
		page.push( this.data[i] );
	};

	return page;
}

Ideas.prototype.findIdea = function( _id ) 
{
	var idea;

	for ( var i = 0; i < this.data.length; i++ ) 
	{	
		if( this.data[i].ID == _id )
		{
			idea = this.data[i];
		}
	}

	return idea;
};

Ideas.prototype.submitIdea = function( idea ) {};

