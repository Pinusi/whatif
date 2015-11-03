
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Importing other routes
 */

router.use('/api/ideas', require('./ideas'));
router.use('/api/idea', require('./idea'));
router.use('/api/ratings', require('./ratings'));
router.use('/api/users', require('./users'));
router.use('/api/user', require('./user'));

/**
 * Extending the router for the route /
 */
 
router.get('/', function( req, res )
{
	res.render('index');
});