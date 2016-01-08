/*
  VARIABLES
*/

var folders = {
  build: '../build',
  src: '../src',
  temp: '.tmp'
};

var css_to_minify = [
  folders.temp + '/{,*/}*.css',
  folders.src + '/client/vendor/normalize.css/normalize.css'
];

/*
  MODULES
*/

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifycss = require('gulp-minify-css');
// var jshint = require('gulp-jshint');
// var uglify = require('gulp-uglify');
// var imagemin = require('gulp-imagemin');
// var rename = require('gulp-rename');
var notify = require('gulp-notify');
// var cache = require('gulp-cache');
// var livereload = require('gulp-livereload');
var del = require('del');
var es = require('event-stream');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(folders.src + '/client/sass/{,*/}*.scss', ['styles']);

  // Watch .scss files
  gulp.watch('gulpfile.js', ['build']);

  // Watch .js files
  // gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  // livereload.listen();

  // // Watch any files in dist/, reload on change
  // gulp.watch([folders.build + '/**']).on('change', livereload.changed);

});

// Styles
gulp.task('styles', function() {
  var vendorFiles = gulp.src(css_to_minify)
    .pipe(minifycss());
  var appFiles = sass(folders.src + '/client/sass/all.scss', {style: 'expanded'});

  return es.concat(vendorFiles,appFiles)
      .pipe(concat('style.min.css'))
      .pipe(minifycss())
      .pipe(gulp.dest(folders.build + '/client/css/'))
      .pipe(connect.reload())
      .pipe(notify({message: 'Styles task complete'}));
});

// gulp.task('scripts', function() {
//   return gulp.src('src/scripts/**/*.js')
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/assets/js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/assets/js'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });

// Clean
gulp.task('clean', function() {
  return del([
    folders.temp,
    folders.build + '/**/*',
    '!' + folders.build + '/server',
    '!' + folders.build + '/server/db/**'
  ], {force: true});
});

// Connect
gulp.task('connect', function() {
  connect.server({
    root: folders.build + '/client',
    port: 5000,
    livereload: true
  });
});

// Build
gulp.task('build', ['clean'], function() {
  gulp.start('styles');
});

// DEFAULT
gulp.task('default', ['watch', 'connect'], function() {
  gulp.start('build');
});
