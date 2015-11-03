
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
var Ideas = require('../models/ideas');
var Q = require('q');

var ideas = new Ideas();

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Extending the router for the route /comments
 */

router.get('/:perpage/:page/:sorting', function( req, res ) 
{
	getIdeasHandler( req, res );
	//TBD implement hot
});

router.post('/', function( req, res ) {
	//TBD implement submit an idea
});

var getIdeasHandler = function( _req, _res )
{
	var params = {
		idea_per_page: _req.params.perpage,
		page: _req.params.page,
		sorting: _req.params.sorting
	};

	ideas.getIdeas( params )
		.then(function( _page ){
			if( _page.length === 0 )
			{
				_res.send('Error 404: No idea found');
			}
			else
			{
		  		_res.json( _page );
		  	}
		});
}