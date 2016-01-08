'use strict';

define(
    [
        'tpl!../templates/ideas'
     ],
    function(
        tmp_ideas
    ) {

      var templates = {
        'ideas': tmp_ideas

      };

      return {
        get_template: templates
      };
    });
