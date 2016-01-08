/*
  Imported node_modules
*/

var tools_folder = '../../../tools/node_modules/';
var chai = require(tools_folder + 'chai');
var sinon = require(tools_folder + 'sinon');

/*
  Imported project modules
*/

var build_folder = '../../../build/server/';
var DatabaseConnection = require(build_folder + 'middlewares/dbconnector');
var Users = require(build_folder + 'models/users');

/*
  Others
*/

var expect = chai.expect;

/*
  TESTS
*/

describe('Models: Users', function() {
  var connection;

  before(function() {
    connection = new DatabaseConnection();
  });

  it('should set up the object correctly', function() {
    var users = new Users(connection);

    expect(users.connection).to.exist;
    users.connection.should.eql(connection);
  });

  describe('#submitUser()', function() {
    var users;
    var run;

    before(function() {
      users = new Users(connection);
      run = sinon.stub(connection, 'run').returns();
    });

    it('should get called with userID', function() {
      var fn = users.submitUser({});

      expect(fn).to.be.undefined;
    });

    it('should run the correct query', function() {
      var query;
      var params = {
        userID: 'foo'
      };

      users.submitUser(params);

      query = 'INSERT INTO Users (ID) VALUES (' + params.userID + ')';

      expect(run.calledWithExactly(query)).to.be.true;
    });
  });

});
