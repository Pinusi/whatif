/*
  Imported node_modules
*/

var tools_folder = '../../../tools/node_modules/';
var chai = require(tools_folder + 'chai');
var sinon = require(tools_folder + 'sinon');
var Q = require(tools_folder + 'q');

/*
  Imported project modules
*/

var build_folder = '../../../build/server/';
var Ratings = require(build_folder + 'models/ratings');
var DatabaseConnection = require(build_folder + 'middlewares/dbconnector');

/*
  Others
*/

var expect = chai.expect;
var should = chai.should();

/*
  TESTS
*/

describe('Models: Ratings', function() {
  var connection;

  before(function() {
    connection = new DatabaseConnection();
  });

  it('should set up the object correctly', function() {
    var ratings = new Ratings(connection);

    expect(ratings.data).to.exist;
    ratings.data.should.eql([]);
    expect(ratings.connection).to.exist;
    ratings.connection.should.eql(connection);
  });

  describe('#update()', function() {
    var data = 5;
    var ratings;
    var query;

    before(function() {
      ratings = new Ratings(connection);
      query = sinon.stub(connection, 'query').returns(Q.resolve(data));
    });

    it('should get all ratings from the database', function(done) {
      ratings.update().then(function() {
        expect(ratings.data).to.equal(data);
        expect(query.calledWithExactly('SELECT * FROM UserIdeaRatings')).to.be.true;
        done();
      });
    });

    after(function() {
      query.restore();
    });
  });

  describe('#submitRating()', function() {
    var ratings;
    var run;

    before(function() {
      ratings = new Ratings(connection);
      run = sinon.stub(connection, 'run').returns();
    });

    it('should be called with a username param', function() {
      var ratings_obj = {
        ideaId: '1',
        rating: '1',
        date: '12/19/1976'
      };

      var fn = ratings.submitRating(ratings_obj);

      expect(fn).to.be.undefined;
    });

    it('should be called with a ideaId param', function() {
      var ratings_obj = {
        username: 'ceci',
        rating: '1',
        date: '12/19/1976'
      };

      var fn = ratings.submitRating(ratings_obj);

      expect(fn).to.be.undefined;
    });

    it('should be called with a rate param', function() {
      var ratings_obj = {
        username: 'ceci',
        ideaId: '1',
        date: '12/19/1976'
      };

      var fn = ratings.submitRating(ratings_obj);

      expect(fn).to.be.undefined;
    });

    it('should save the rating with the param passed', function() {
      var ratings_obj = {
        username: 'ceci',
        ideaId: '1',
        rating: '1',
        date: '12/19/1976'
      };
      var query = 'INSERT INTO UserIdeaRatings (UserID, IdeaID, Rating, Date) VALUES (\'' + ratings_obj.username + '\', ' + ratings_obj.ideaId + ', ' + ratings_obj.rating + ', ' + new Date(ratings_obj.date).getTime() + ')';

      ratings.submitRating(ratings_obj);

      expect(run.calledWithExactly(query)).to.be.true;
    });
  });

  describe('#getAllRatingsGroupedByUserID()', function() {
    var ratings;
    var update;

    before(function() {
      ratings = new Ratings(connection);
      update = sinon.stub(ratings, 'update').returns(Q.resolve());
    });

    it('should first update', function(done) {
      ratings.getAllRatingsGroupedByUserID(4).then(function() {
        expect(update.called).to.be.true;
        done();
      });
    });
    it('should call filterByUser with the id passed', function() {
      var id = 1;

      var filterByUser = sinon.stub(ratings, 'filterByUser');

      ratings.getAllRatingsGroupedByUserID(id).then(function(done) {
        expect(filterByUser.calledWithExactly(id)).to.be.true;
        done();
      });
    });
  });

  describe('#filterByUser()', function() {
    var returned_data = [];
    var ratings;
    var fake_data;
    var id = 1;

    before(function() {
      for (var i = 0; i < 10; i++) {
        returned_data.push({
          ID: 8,
          UserID: i,
          IdeaID: 1,
          Rating: 1,
          Date: 1446656375956
        });
      }

      fake_data = [{
        ID: 8,
        UserID: id,
        IdeaID: 1,
        Rating: 1,
        Date: 1446656375956
      }];
      ratings = new Ratings(connection);
      ratings.data = returned_data;
    });

    it('should return an array with ratings with the user id passed', function() {
      var fn = ratings.filterByUser(id);

      expect(fn).to.eql(fake_data);
    });
  });

});
