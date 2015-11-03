
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
var Q = require('q');
var Users = require('../models/users');

var users = new Users();

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Extending the router for the route /comments
 */

router.post('/', function( req, res ) 
{
	/*{
		userId, if new user is gonna post, otherwise the computer has a cookie with the id
	}*/
	newUserHandler( req, res );
});

var newUserHandler = function( _req, _res )
{
	if( !_req.body.id )
	{
		_res.send("Error 404: Missing parameters for the rating");
		return;
	}

	var params = {
		userID: _req.body.id
	};

	users.submitUser( params )
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
	
};