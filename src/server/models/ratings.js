
/**
 * Module dependencies.
 * @private
 */

var Q = require('q');

/**
 * Module exports.
 * @public
 */

module.exports = Ratings;

function Ratings(_connection) {
  //get the full list
  this.data = [];
  this.connection = _connection;
};

/**
 * update.
 * save array from db
 */
Ratings.prototype.update = function() {
  var query = 'SELECT * FROM UserIdeaRatings';

  this.data = [];

  return this.connection.query(query).then(function(data) {
    this.data = data;
  }.bind(this));
};

Ratings.prototype.submitRating = function(_params) {
  if (!_params || !_params.username || !_params.ideaId || !_params.rating) {
    return;
  }

  var date = _params.date ? new Date(_params.date).getTime() : new Date().getTime();
  var query = 'INSERT INTO UserIdeaRatings (UserID, IdeaID, Rating, Date) VALUES (\'' + _params.username + '\', ' + _params.ideaId + ', ' + _params.rating + ', ' + date + ')';

  return this.connection.run(query);
};

Ratings.prototype.getAllRatingsGroupedByUserID = function(_id) {
  //update and paginate
  return this.update()
    .then(function() {
  return ratings_by_user = this.filterByUser(_id);
    }.bind(this));
};

Ratings.prototype.filterByUser = function(_id) //for now userid
{
  var ratings_by_user = [];

  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i].UserID == _id) {
      ratings_by_user.push(this.data[i]);
    }
  }

  return ratings_by_user;
};

