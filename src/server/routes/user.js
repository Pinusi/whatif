
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
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

router.get('/:username/ratings', function( req, res ) 
{
	//TBD implement get rating by user
});