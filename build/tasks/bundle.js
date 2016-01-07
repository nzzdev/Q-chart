var gulp  = require('gulp'),
    shell = require('gulp-shell'),
    paths = require('../paths'),
    runSequence = require('run-sequence');

var bundle = {
  includes: [
    'index'
  ],
  excludes: []
}

var bundleName = 'deployable-build/index'

function bundleCommands() {
  var bundleCommands = [];
  var modules = bundle.includes.join(' + ');
  if(bundle.excludes.length > 0){
    modules = modules + ' - ' + bundle.excludes.join(' - ');
  }
  bundleCommands.push('jspm bundle ' + modules + ' ' + bundleName + '.js --minify --skip-source-maps');
  return bundleCommands;
}

gulp.task('copy-theme-for-deployment', function() {
  return gulp.src([paths.output + '/amd/themes/**'])
    .pipe(gulp.dest('./deployable-build/themes'));
});

gulp.task('bundle-js', ['build'], shell.task(bundleCommands()));

gulp.task('bundle', function(callback) {
  return runSequence(
    'build',
    'copy-theme-for-deployment',
    'bundle-js',
    callback
  );
});
