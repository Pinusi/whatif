
/**
 * Module dependencies.
 * @private
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var index = require('./routes/index');

/**
 * Module variables.
 * @private
 */

 var app = express();

/**
 * Module exports.
 * @public
 */

module.exports = app;


/**
 * Extending the app for the parsing json
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Importing base route
 */

app.use('/', index);

/**
 * Extending the app for using jade as template engine
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Extending the app for using public as folder for static files
 */
 
app.use(express.static(path.join(__dirname, 'public')));