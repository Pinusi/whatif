
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

router.get('/:id', function( req, res ) 
{
	getIdeaHandler( req, res );
});

router.post('/:id', function( req, res ) {
	postIdeaUpdateHandler( req, res );
});

var getIdeaHandler = function( _req, _res )
{
	ideas.getIdeaByID( _req.params.id )
		.then(function( _idea ){
			if( _idea )
			{
				_res.json( _idea );
			}
			else
			{
				_res.send('Error 404: No idea found');
		  	}
		});
}

var postIdeaUpdateHandler = function( _req, _res )
{
	//TBD
}