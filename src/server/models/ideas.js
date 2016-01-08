
/**
 * Module dependencies.
 * @private
 */

var Q = require('q');

/**
 * Module exports.
 * @public
 */

module.exports = Ideas;

function Ideas(_connection) {
  //get the full list
  this.data = [];
  this.page = [];
  this.connection = _connection;
};

/**
 * update.
 * save array from db
 * @order: nothing ( as they get ), latest ( ordered by date )
 */

Ideas.prototype.update = function(_order) {
  var query = '',
  that = this;

  //clean data
  this.data = [];

  //query
  switch (_order)
  {
    case 'latest':
      query = 'SELECT * FROM Ideas ORDER BY Date';
      break;

    default:
      query = 'SELECT * FROM Ideas';
  };

  //request data from db
  return this.connection.query(query).then(function(data) {
    this.data = data;
  }.bind(this));

};

/**
 * getIdeas.
 * get a list of ideas sorted and paginated
 * @params: idea_per_page, page, sorting
 */

Ideas.prototype.getIdeas = function(_params) {
  var deferred = Q.defer();

  if (!_params || _params.idea_per_page === undefined || _params.page === undefined) {
    deferred.reject('missing params');
    return deferred.promise;
  } else {
    //update and paginate
    return this.update(_params.sorting)
			.then(function() {
  //paginate
  return this.paginate(_params.idea_per_page, _params.page);

			}.bind(this));
  }
};

/**
 * getIdeaByID.
 * return @Object = { ID: id,  }
 */

Ideas.prototype.getIdeaByID = function(_id) {
  //update and paginate
  return this.update()
		.then(function() {
      return idea = this.findIdea(_id);
		}.bind(this));
};

/**
 * paginate.
 * paginate the ideas and put them into page variable
 */

Ideas.prototype.paginate = function(_perpage, _page) {
  if (_perpage === undefined || _page === undefined || typeof _page !== 'number' || typeof _perpage !== 'number') {
    return;
  }

  //clean page
  var page = [];

  //starting point
  var starting_idea = _perpage * _page;
  var limit = _perpage + starting_idea;

  //save ideas in the page
  for (var i = starting_idea; i < limit; i++) {
    page.push(this.data[i]);
  };

  return page;
};

Ideas.prototype.findIdea = function(_id) {
  var idea;

  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i].ID == _id) {
      idea = this.data[i];
    }
  }

  return idea;
};

Ideas.prototype.submitIdea = function(_params) {
  if (!_params || !_params.title || !_params.description) {
    return;
  }

  var date = _params.date ? new Date(_params.date).getTime() : new Date().getTime();
  var query = 'INSERT INTO Ideas (Title, Summary, Description, Date) VALUES (\'' + _params.title + '\', \'' + _params.summary + '\', \'' + _params.description + '\', ' + date + ')';

  return this.connection.run(query);
};

