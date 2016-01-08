/*
  Imported node_modules
*/

var tools_folder = '../../../tools/node_modules/';
var chai = require(tools_folder + 'chai');
var sinon = require(tools_folder + 'sinon');
var sqlite3 = sinon.stub(require(tools_folder + 'sqlite3').verbose(), 'Database', function() {
  return {
    serialize: function(callback) {
      callback();
    },
    each: function() {}
  };
});

/*
  Imported project modules
*/

var build_folder = '../../../build/server/';
var DatabaseConnection = require(build_folder + 'middlewares/dbconnector');

/*
  Others
*/

var expect = chai.expect;

/*
  TESTS
*/

describe('Models: Dbconnector', function() {

  it('should set the db location correctly', function() {
    var connection = new DatabaseConnection();
    expect(connection.db_location).to.exist;
  });

  describe('#open()', function() {
    it('should create the connection to the db', function(done) {
      var connection = new DatabaseConnection();

      connection.open().then(function() {
        expect(connection.db).to.exist;
        done();
      });
    });

    it('should not create the connection to the db if file doesn\'t exist', function(done) {
      var connection = new DatabaseConnection('some_nonexistent_file');

      connection.open().catch(function(err) {
        expect(err).to.equal('db not available');
        expect(connection.db).to.not.exist;
        done();
      });
    });
  });

  describe('#query()', function() {
    it('should execute the query against the db correctly');
    it('should raise an error if there are problem with the db');
  });

  describe('#run()', function() {
    it('should run a query against the db');
    it('should raise an error if there are problem with the db');
  });

  describe('#close()', function() {
    it('should close the connection');
  });

});
