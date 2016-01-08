/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var router = express.Router();
var Ideas = require('../models/ideas');
var Q = require('q');
var DatabaseConnection = require('../middlewares/dbconnector');

var connection = new DatabaseConnection();
connection.open();
var ideas = new Ideas(connection);

/**
 * Module exports.
 * @public
 */

module.exports = router;

/**
 * Extending the router for the route /comments
 */

router.get('/:perpage/:page/:sorting', function(req, res) {
  getIdeasHandler(req, res);
  //TBD implement hot
});

router.post('/', function(req, res) {
  submitIdeaHandler(req, res);
});

var getIdeasHandler = function(_req, _res) {
  var params = {
    idea_per_page: parseInt(_req.params.perpage),
    page: parseInt(_req.params.page),
    sorting: _req.params.sorting
  };

  ideas.getIdeas(params)
		.then(function(_page) {
  if (_page.length === 0) {
    _res.status(404).send({error: 'No idea found'});
  } else {
    _res.json(_page);
  }
		});
};

var submitIdeaHandler = function(_req, _res) {
  if (!_req.body.title || !_req.body.description) {
    _res.status(404).send({error: 'Missing parameters for the rating'});
    return;
  }

  var params = {
    title: _req.body.title,
    summary: _req.body.summary,
    description: _req.body.description
  };

  ideas.submitIdea(params)
		.then(function(err) {
  if (err) {
    _res.status(404).send({error: 'Couldn\'t submit the rating'});
  } else {
    _res.end();
  }
		});
};
