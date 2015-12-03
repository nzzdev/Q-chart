var gulp  = require('gulp'),
    shell = require('gulp-shell');

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

gulp.task('bundle', ['build'], shell.task(bundleCommands()));
