
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
var Ratings = require('../models/ratings');
var Q = require('q');
var DatabaseConnection = require('../middlewares/dbconnector');


var connection = new DatabaseConnection();
connection.open();
var ratings = new Ratings(connection);

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Extending the router for the route /comments
 */

router.get('/:username/ratings', function(req, res) {
  //for now username === userid
  ratingsByUserHandler(req, res);
});

var ratingsByUserHandler = function(_req, _res) {

  ratings.getAllRatingsGroupedByUserID(_req.params.username)
		.then(function(_ratings) {
  if (_ratings.length === 0) {
    _res.send('Error 404: No idea found');
  } else {
    _res.json(_ratings);
  }
		});
};
