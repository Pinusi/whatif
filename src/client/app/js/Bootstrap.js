'use strict';

define(['jquery', 'underscore', 'q', 'Templates'],
    function($, _, Q, Templates) {

      var props = {
        elem: {
          ideas: $('.list')
        }
      };

      var init = function() {
        getIdeas(0, 10).then(function(_ideas) {
          _ideas.forEach(function(_idea) {
            props.elem.ideas.append(Templates.get_template['ideas']({data: _idea}));
          });
        });
      };

      var getIdeas = function(_page, _howmany) {
        var load_ideas_completed = Q.defer();

        $.ajax({
              method: 'GET',
              url: 'http://localhost:5455/api/ideas/' + _howmany + '/' + _page + '/latest',
              dataType: 'json',
              success: function(_data) {
                // console.log( _data );
                load_ideas_completed.resolve(_data);
              },
              error: function(err) {
                console.log(err);
              }
            });

        return load_ideas_completed.promise;
      };

      return {
        init: init
      };

    });
