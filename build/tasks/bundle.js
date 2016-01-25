var gulp  = require('gulp'),
    shell = require('gulp-shell'),
    Builder = require('systemjs-builder')
    paths = require('../paths'),
    runSequence = require('run-sequence');

var bundle = {
  includes: [
    'index'
  ],
  excludes: [],
}

var bundleName = 'deployable-build/index'

var builder = new Builder('','config.js');

builder.config({
  paths: {
    'q-chart/*': 'dist/system/*',
    'github:*': 'jspm_packages/github/*',
    'npm:*': 'jspm_packages/npm/*'
  },
});

gulp.task('copy-theme-for-deployment', function() {
  return gulp.src([paths.output + '/amd/themes/**'])
    .pipe(gulp.dest('./deployable-build/themes'));
});

gulp.task('bundle-js', function(callback) {
  builder
    .bundle('q-chart/index', bundleName + '.js', { normalize: true, minify: true })
    .then(function() {
      callback();
    })
});

gulp.task('bundle', function(callback) {
  return runSequence(
    'build',
    'copy-theme-for-deployment',
    'bundle-js',
    callback
  );
});
