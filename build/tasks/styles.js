var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    paths         = require('../paths'),
    Eyeglass      = require("eyeglass").Eyeglass;

var options = {
  includePaths: ['jspm_packages/github', 'jspm_packages/npm']
}
var eyeglass = new Eyeglass(options);
eyeglass.enableImportOnce = false;

module.exports = gulp.task('build-styles', function() {

  var processors = [
        autoprefixer({browsers: ['last 3 version', 'chrome 30', 'ios_saf 7']}),
  ];

  return gulp.src(paths.style)
      .pipe(sass(eyeglass.sassOptions()))
      .pipe(postcss(processors))

      .pipe(gulp.dest(paths.output + 'amd'))
      .pipe(gulp.dest(paths.output + 'system'))
      .pipe(gulp.dest(paths.output + 'commonjs'))
      .pipe(gulp.dest(paths.output + 'es6'));
})
