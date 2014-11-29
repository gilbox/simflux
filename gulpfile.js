var gulp            = require('gulp'),
    browserify      = require('browserify'),
    source          = require('vinyl-source-stream'),
    $               = require('gulp-load-plugins')();

gulp.task('browserify', [], function () {
  return browserify({
    entries: './simflux.js',
    debug: true
  })
    .bundle()
    .pipe(source('simflux.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch('./**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);
