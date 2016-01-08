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
var DatabaseConnection = require(build_folder + 'middlewares/dbconnector');
var Ideas = require(build_folder + 'models/ideas');

/*
  Others
  */

var expect = chai.expect;

/*
  TESTS
  */

describe('Modules: Ideas', function() {

  var connection;

  before(function() {
      connection = new DatabaseConnection();
    });

  it('should set up the object correctly', function() {
      var ideas = new Ideas(connection);

      expect(ideas.data).to.exist;
      ideas.data.should.eql([]);
      expect(ideas.page).to.exist;
      ideas.page.should.eql([]);
      expect(ideas.connection).to.exist;
      ideas.connection.should.eql(connection);
    });

  describe('#update()', function() {
      var data = 5;
      var ideas;
      var query;

      before(function() {
        ideas = new Ideas(connection);
        query = sinon.stub(connection, 'query').returns(Q.resolve(data));
      });

      it('should get all ideas from the database', function(done) {
      // var ideas = new Ideas( connection );

      ideas.update().then(function() {
        expect(ideas.data).to.equal(data);
        expect(query.calledWithExactly('SELECT * FROM Ideas')).to.be.true;
        done();
      });
    });

      it('should save the latest data if latest is passed', function(done) {
      // var ideas = new Ideas( connection );

      ideas.update('latest').then(function() {
        expect(query.calledWithExactly('SELECT * FROM Ideas ORDER BY Date')).to.be.true;
        done();
      });
    });

      after(function() {
        query.restore();
      });
    });

  describe('#getIdeas()', function() {

    var ideas;
    var update;

    before(function() {
        ideas = new Ideas(connection);
        update = sinon.stub(ideas, 'update').returns(Q.resolve());
      });

    it('should return an error if page and per_page params are missing', function(done) {
        ideas.getIdeas().catch(function(err) {
          expect(err).to.equals('missing params');
          done();
        });
      });

    it('should first update', function(done) {
        ideas.getIdeas(
        {
          idea_per_page: 1,
          page: 1
        }
        ).then(function() {
          expect(update.called).to.be.true;
          done();
        });
      });

    it('should pass the idea_per_page and page params to paginate function', function(done) {
        var idea_per_page = 30;
        var page = 1;

        var paginate = sinon.stub(ideas, 'paginate').returns(Q.resolve({}));
        ideas.getIdeas(
        {
          idea_per_page: idea_per_page,
          page: page
        }
        ).then(function() {
          expect(paginate.calledWithExactly(idea_per_page,page)).to.be.true;
          done();
          paginate.restore();
        });

      });

    after(function() {
        update.restore();
      });
  });

  describe('#getIdeaByID()', function() {
    var ideas;
    var update;

    before(function() {
      ideas = new Ideas(connection);
      update = sinon.stub(ideas, 'update').returns(Q.resolve());
    });

    it('should first update', function(done) {
      ideas.getIdeaByID(1).then(function() {
        expect(update.called).to.be.true;
        done();
      });
    });

    it('should call find id with the specific id passed', function(done) {
      var id = 1;

      var findidea = sinon.stub(ideas, 'findIdea');

      ideas.getIdeaByID(id).then(function() {
        expect(findidea.calledWithExactly(id)).to.be.true;
        done();
      });
    });

    after(function() {
      update.restore();
    });
  });

  describe('#paginate()', function() {
    var returned_data = [];
    var ideas;
    var per_page = 10;
    var page = 1;

    before(function() {
        //fill fake data
        for (var i = 0; i < per_page * 2; i++) {
          returned_data.push({
            ID: i,
            Title: 'Foo',
            Summary: 'Bar',
            Description: 'FooBar',
            Date: 1446650533753
          });
        }
        ideas = new Ideas(connection);
        ideas.data = returned_data;
      });

    it('should be called with two integers params', function() {
      var fn = ideas.paginate();

      expect(fn).to.be.undefined;
    });

    it('should return an array of ideas of length per_page or less', function() {
      var fn = ideas.paginate(per_page, page);

      expect(fn).to.be.a('array');
      expect(fn.length).to.be.at.most(per_page);
    });

    it('should return an array of ideas of which the first idea should respect the page index', function() {
      var fn = ideas.paginate(per_page, page);

      expect(fn).to.be.a('array');
      expect(fn[0].ID).to.eql(page * per_page);
    });
  });

  describe('#findIdea()', function() {
    var returned_data = [];
    var ideas;
    var id = 1;

    before(function() {
        //fill fake data
        for (var i = 0; i < 10; i++) {
          returned_data.push({
            ID: i,
            Title: 'Foo',
            Summary: 'Bar',
            Description: 'FooBar',
            Date: 1446650533753
          });
        }
        ideas = new Ideas(connection);
        ideas.data = returned_data;
      });

    it('should return the idea with the id passed', function() {
      var fn = ideas.findIdea(id);

      expect(fn).to.eql({
        ID: 1,
        Title: 'Foo',
        Summary: 'Bar',
        Description: 'FooBar',
        Date: 1446650533753
      });
    });
  });

  describe('#submitIdea()', function() {
    var ideas;
    var run;

    before(function() {
      ideas = new Ideas(connection);
      run = sinon.stub(connection, 'run').returns();
    });

    it('should be called with a title param', function() {
      var idea_obj = {
        description: 'foo',
        summary: 'bar',
        date: '12/19/1976'
      };

      var fn = ideas.submitIdea(idea_obj);

      expect(fn).to.be.undefined;
    });

    it('should be called with a description param', function() {
      var idea_obj = {
        title: 'foo',
        summary: 'bar',
        date: '12/19/1976'
      };

      var fn = ideas.submitIdea(idea_obj);

      expect(fn).to.be.undefined;
    });

    it('should save the idea with the params passed', function() {
      var idea_obj = {
        title: 'foo',
        summary: 'bar',
        description: 'foobar',
        date: '12/19/1976'
      };
      var query = 'INSERT INTO Ideas (Title, Summary, Description, Date) VALUES (\'' + idea_obj.title + '\', \'' + idea_obj.summary + '\', \'' + idea_obj.description + '\', ' + new Date(idea_obj.date).getTime() + ')';

      ideas.submitIdea(idea_obj);

      expect(run.calledWithExactly(query)).to.be.true;
    });

    after(function() {
      run.restore();
    });
  });
});
