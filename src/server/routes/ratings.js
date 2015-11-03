
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
var Ratings = require('../models/ratings');
var Q = require('q');

var ratings = new Ratings();

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Extending the router for the route /comments
 */

router.post('/', function( req, res ) {
	/*{
		username
		rating
		ideaId
	}*/
	postRatingHandler( req, res );
});

var postRatingHandler = function( _req, _res )
{
	if( !_req.body.username || !_req.body.rating || !_req.body.ideaId )
	{
		_res.send("Error 404: Missing parameters for the rating");
		return;
	}

	var params = {
		username: _req.body.username,
		rating: _req.body.rating,
		ideaId: _req.body.ideaId
	};

	ratings.submitRating( params )
		.then(function( err ){
			if( err )
			{
				_res.send("Error 404: Couldn't submit the rating");
			}
			else
			{
		  		_res.end();
		  	}
		});
}