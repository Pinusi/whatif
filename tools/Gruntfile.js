module.exports = function(grunt) {

  var modules = [];
  var pkg = grunt.file.readJSON('package.json')

  for (var key in pkg.dependencies) {
    modules.push( key + "/**/*" );
  }

  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    //JSON Configs
    pkg: grunt.file.readJSON('package.json'),

    //Folders
    folder: {
      development: '../src',
      distribution: '../build',
      temporary: '.tmp',
      test: '../tests'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
          files: ['<%= folder.development %>/client/app/js/{,*/,**/}*.js',
                  '<%= folder.development %>/client/app/templates/{,*/,**/}*.html'],
          tasks: ['requirejs:dev']
      },
      gruntfile: {
          files: ['Gruntfile.js'],
          tasks: ['build']
      },
      sass: {
          files: ['<%= folder.development %>/client/sass/{,*/,**/}*.{scss,sass}'],
          tasks: ['sass']
      },
      // html:{
      //   files: ['<%= folder.development %>/client/index.html',
      //           '<%= folder.development %>/client/app/includes/{,*/,**/}*.html'],
      //   tasks: ['includes']
      // },
      images:{
        files: ['<%= folder.development %>/client/assets/img/{,*/}*.*'],
        tasks: ['copy:img']
      },
      fonts:{
        files: ['<%= folder.development %>/client/assets/fonts/{,*/}*.*'],
        tasks: ['copy:fonts']
      },
      server:{
        files: ['<%= folder.development %>/server/{,*/,**/}*.*'],
        tasks: ['copy:server']
      },
      livereload: {
          options: {
            livereload: true,
            open: true
          },
          files: [
              '<%= folder.distribution %>/public/css/{,*/}*.css',
              '<%= folder.distribution %>/public/js/{,*/}*.js',
              '<%= folder.distribution %>/public/img/{,*/}*.{jpeg,jpg,png}',
              '.rebooted'
          ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    // jshint: {
    //    options: {
    //       bitwise: true,
    //       browser: true,
    //       curly: true,
    //       eqeqeq: true,
    //       eqnull: true,
    //       expr: true,
    //       esnext: true,
    //       latedef: false,
    //       newcap: true,
    //       noarg: true,
    //       node: true,
    //       quotmark: "single",
    //       smarttabs: false,
    //       strict: false,
    //       undef: true,
    //       unused: false,
    //       trailing: true,
    //       validthis: true,
    //       '-W099': false,
    //       "-W060": false,
    //       globals: {
    //         jQuery: false,
    //         "$": false,
    //         "_": false,
    //         "Q": false,
    //         "Backbone": false,
    //         "Modernizr": false,
    //         "Snap": false,
    //         "GG": false,
    //         "paper": false,
    //         "Howl": false,
    //         "Howler": false,
    //         "ga": false
    //       }
    //     },
    //     all: [
    //         '<%= folder.development %>/app/{,*/}*.js'
    //     ]
    // },

    // Copies remaining files to places other tasks can use
    copy: {
        img: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= folder.development %>/client',
                dest: '<%= folder.distribution %>/public',
                src: [
                    'assets/img/{,*/}*.*'
                ]
            }]
        },
        fonts: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= folder.development %>/client',
                dest: '<%= folder.distribution %>/public',
                src: [
                    'assets/fonts/{,*/}*.*'
                ]
            }]
        },
        server: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= folder.development %>/server',
                dest: '<%= folder.distribution %>',
                src: [
                    '**', '!db/**'
                ]
            }]
        },
        copy_package: {
            files: [{
                expand: true,
                dot: true,
                cwd: '',
                dest: '<%= folder.distribution %>',
                src: [
                    'package.json'
                ]
            }]
        },
        modules: {
            files: [{
                expand: true,
                dot: true,
                cwd: 'node_modules',
                dest: '<%= folder.distribution %>/node_modules',
                src: modules
            }]
        }
        // ,
        // favicons: {
        //     files: [{
        //         expand: true,
        //         dot: true,
        //         cwd: '<%= folder.development %>',
        //         dest: '<%= folder.distribution %>',
        //         src: [
        //             'favicon.ico',
        //             'apple-touch-icon.png'
        //         ]
        //     }]
        // }
    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                force: true,
                cwd: '<%= folder.development %>/client/assets/img',
                src: '{,*/}*.{gif,jpeg,jpg,png}',
                dest: '<%= folder.temporary %>/public/assets/img'
            }]
        }
    },

    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {                         // Dictionary of files
          '<%= folder.distribution %>/public/css/style.min.css': '<%= folder.development %>/client/sass/all.scss'
        }
      }
    },

    requirejs: {
        dev: {
            options: {
                baseUrl: "<%= folder.development %>/client/app/js/",
                mainConfigFile: "<%= folder.development %>/client/app/js/Main.js",
                out: "<%= folder.distribution %>/public/js/script.min.js",
                include: ["../../vendor/almond/almond", "Main.js"],
                wrap: true,
                optimize:"none",
                preserveLicenseComments: false,
                generateSourceMaps: false
            }
        },
        prod: {
            options: {
                baseUrl: "<%= folder.development %>/client/app/js/",
                mainConfigFile: "<%= folder.development %>/client/app/js/Main.js",
                out: "<%= folder.distribution %>/public/js/script.min.js",
                include: ["../../vendor/almond/almond", "Main.js"],
                wrap: true,
                optimize:"uglify2",
                preserveLicenseComments: false,
                generateSourceMaps: false
            }
        }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'], //'node-inspector'
        options: {
          logConcurrentOutput: true
        }
      }
    },

    nodemon: {
      dev: {
        script: '<%= folder.distribution %>/bin/www',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '5455'
          },
          watch: ['<%= folder.distribution %>'],
          ignore: ['<%= folder.distribution %>/node_modules/**', '<%= folder.distribution %>/public/**'],
          // omit this property if you aren't serving HTML files and 
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('open')('http://localhost:5455');
              }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 2000);
            });
          }
        }
      }
    },

    // processhtml: {
    //     options: {
    //         strip:true
    //     },
    //     index: {
    //         files: {
    //             '<%= folder.distribution %>/index.html': '<%= folder.development %>/client/index.html'
    //         }
    //     }
    //     // ,
    //     // json: {
    //     //     files: {
    //     //         '<%= folder.distribution %>/partner/data.json': '<%= folder.development %>/partner/json/data.json'
    //     //     }
    //     // }
    // },

    // Empties folders to start fresh
    clean: {
      build: {
        src: [
              '<%= folder.temporary %>',
              '<%= folder.distribution %>/**/*',
              '!<%= folder.distribution %>',
              '!<%= folder.distribution %>/db/**'
              ],
      },
      options:{
        force: true
      }
    }

  });
  
  grunt.registerTask('build', [
        'clean',
        'sass',
        'copy:img',
        'copy:server',
        'copy:copy_package',
        'copy:fonts',
        'copy:modules',
        'requirejs:dev'
    ]);

  grunt.registerTask('vendor', [
        'clean',
        'sass',
        'imagemin',
        'copy:server',
        'copy:copy_package',
        'copy:fonts',
        'copy:modules',
        'requirejs:prod'
    ]);

  // Default task(s).

  grunt.registerTask('default', [
    'build',
    // 'connect:livereload',
    'concurrent'
    ]);

};