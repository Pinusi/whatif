'use strict';

(function() {

  require.config({

    baseUrl:   '../src/client/app/js',
    paths: {
      jquery:   '../../vendor/jquery/dist/jquery.min',
      q:   '../../vendor/q/q',
      underscore:   '../../vendor/underscore/underscore-min',
      text:   '../../vendor/require-text',
      templates:   '../templates',
      tpl:   '../../vendor/require-tpl',
      // Backbone        :   '../libs/backbone-1.2.3',
      Modernizr:   '../../vendor/modernizr/modernizr'
    }
  });

  require(['Bootstrap', 'jquery'],
        function(Bootstrap, $) {

          // Bootstrap.init();
          // $.ajax({
          //   method: "GET",
          //   url: "http://localhost:5455/api/user/1234/ratings"
          // });

          // $.ajax({
          //   method: "POST",
          //   url: "http://localhost:5455/api/users",
          //   data: { id: "1234" }
          // });

          // $.ajax({
          //   method: "POST",
          //   url: "http://localhost:5455/api/ideas",
          //   data: { title: "Prova", description: "Prova" }
          // });

        });

}());
