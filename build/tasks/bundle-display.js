var gulp  = require('gulp'),
    shell = require('gulp-shell');

var bundle = {
  includes: [
    'display'
  ],
  excludes: []
}

var bundleName = 'deployable-build/display'

function bundleCommands() {
  var bundleCommands = [];
  var modules = bundle.includes.join(' + ');
  if(bundle.excludes.length > 0){
    modules = modules + ' - ' + bundle.excludes.join(' - ');
  }
  bundleCommands.push('jspm bundle ' + modules + ' ' + bundleName + '.js --minify --skip-source-maps');
  return bundleCommands;
}

gulp.task('bundle-display', shell.task(bundleCommands()));
