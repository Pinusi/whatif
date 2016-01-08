module.exports = function(grunt) {

  var modules = [];
  var pkg = grunt.file.readJSON('package.json');

  for (var key in pkg.dependencies) {
    modules.push(key + '/**/*');
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
      test: '../spec'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= folder.development %>/client/app/js/{,*/,**/}*.js',
                '<%= folder.development %>/client/app/templates/{,*/,**/}*.html'],
        tasks: ['requirejs:dev', 'mocha']
      },
      tests_client: {
        files: ['<%= folder.test %>/client/{,*/,**/}*.*'],
        tasks: ['mocha']
      },
      tests_server: {
        files: ['<%= folder.test %>/server/{,*/,**/}*.*'],
        tasks: ['mochaTest']
      },
      styles: {
        files: ['<%= folder.temporary %>/{,*/}*.css'],
        tasks: ['cssmin']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      sass: {
        files: ['<%= folder.development %>/client/sass/{,*/,**/}*.{scss,sass}'],
        tasks: ['sass']
      },
      html: {
        files: ['<%= folder.development %>/client/index.html'],
        tasks: ['copy:index']
      },
      images: {
        files: ['<%= folder.development %>/client/assets/img/{,*/}*.*'],
        tasks: ['copy:img']
      },
      fonts: {
        files: ['<%= folder.development %>/client/assets/fonts/{,*/}*.*'],
        tasks: ['copy:fonts']
      },
      server: {
        files: ['<%= folder.development %>/server/{,*/,**/}*.*'],
        tasks: ['copy:server', 'mochaTest']
      },
      livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
          },
        files: [
            '<%= folder.distribution %>/client/css/{,*/}*.css',
            '<%= folder.distribution %>/client/js/{,*/}*.js',
            '<%= folder.distribution %>/client/index.html',
            '<%= folder.distribution %>/client/img/{,*/}*.{jpeg,jpg,png}',
            '.rebooted'
        ]
      },
    },

    connect: {
      options: {
        port: 5000,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: ['<%= folder.distribution %>/client'],
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      img: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folder.development %>/client',
          dest: '<%= folder.distribution %>/client',
          src: [
              'assets/img/{,*/}*.*'
          ]
        }]
      },
      index: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folder.development %>/client',
          dest: '<%= folder.distribution %>/client',
          src: [
              'index.html'
          ]
        }]
      },
      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folder.development %>/client',
          dest: '<%= folder.distribution %>/client',
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
          dest: '<%= folder.distribution %>/server',
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
          dest: '<%= folder.distribution %>/server',
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
          dest: '<%= folder.distribution %>/server/node_modules',
          src: modules
        }]
      }
      ,
      favicons: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= folder.development %>/client',
          dest: '<%= folder.distribution %>/client',
          src: [
              'favicon.ico'
          ]
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          force: true,
          cwd: '<%= folder.development %>/client/assets/img',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= folder.temporary %>/client/assets/img'
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
          '<%= folder.temporary %>/main.css': '<%= folder.development %>/client/sass/all.scss'
        }
      }
    },

    requirejs: {
      dev: {
        options: {
          baseUrl: '<%= folder.development %>/client/app/js/',
          mainConfigFile: '<%= folder.development %>/client/app/js/Main.js',
          out: '<%= folder.distribution %>/client/js/script.min.js',
          include: ['../../vendor/almond/almond', 'Main.js'],
          wrap: true,
          optimize: 'none',
          preserveLicenseComments: false,
          generateSourceMaps: false
        }
      },
      prod: {
        options: {
          baseUrl: '<%= folder.development %>/client/app/js/',
          mainConfigFile: '<%= folder.development %>/client/app/js/Main.js',
          out: '<%= folder.distribution %>/client/js/script.min.js',
          include: ['../../vendor/almond/almond', 'Main.js'],
          wrap: true,
          optimize: 'uglify2',
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

    cssmin: {
      build: {
        files: {
          '<%= folder.distribution %>/client/css/style.min.css': [
            '<%= folder.development %>/client/vendor/normalize.css/normalize.css',
            '<%= folder.temporary %>/{,*/}*.css'
          ]
        }
      }
    },

    nodemon: {
      dev: {
        script: '<%= folder.distribution %>/server/bin/www',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '5455'
          },
          watch: ['<%= folder.distribution %>'],
          ignore: ['<%= folder.distribution %>/server/node_modules/**', '<%= folder.distribution %>/server/public/**'],
          // omit this property if you aren't serving HTML files and
          // don't want to open a browser tab on start
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function() {
              // Delay before server listens on port
              // setTimeout(function() {
              //   require('open')('http://localhost:5455');
              // }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function() {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 2000);
            });
          }
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      build: {
        src: [
              '<%= folder.temporary %>',
              '<%= folder.distribution %>/**/*',
              '!<%= folder.distribution %>/server',
              '!<%= folder.distribution %>/server/db/**'
              ],
      },
      options: {
        force: true
      }
    },

    mocha: {
      all: {
        src: ['<%= folder.test %>/client/index.html'],
        options: {
          mocha: {
            ignoreLeaks: true
          },
          run: true
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['<%= folder.test %>/server/**/*.js']
      }
    }

  });

  grunt.registerTask('build', [
        'clean',
        'sass',
        'cssmin',
        'copy:img',
        'copy:favicons',
        'copy:server',
        'copy:copy_package',
        'copy:fonts',
        'copy:modules',
        'copy:index',
        'requirejs:dev',
        'mocha',
        'mochaTest'
    ]);

  grunt.registerTask('vendor', [
        'clean',
        'copy:server',
        'sass',
        'cssmin',
        'imagemin',
        'copy:favicons',
        'copy:copy_package',
        'copy:fonts',
        'copy:modules',
        'copy:index',
        'requirejs:prod'
    ]);

  // Default task(s).

  grunt.registerTask('default', [
    'build',
    'connect:livereload',
    'concurrent'
    ]);

};
