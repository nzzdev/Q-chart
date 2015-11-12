var gulp          = require('gulp'),
    changed       = require('gulp-changed'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    paths         = require('../paths');

module.exports = gulp.task('build-styles', function() {

  var processors = [
        autoprefixer({browsers: ['last 3 version', 'chrome 30', 'ios_saf 7']}),
  ];

  sassOptions = {
    includePaths: ['jspm_packages/github', 'jspm_packages/npm']
  }

  return gulp.src(paths.style)
      // .pipe(changed(paths.outputStyle,{extension: '.css'}))
      .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
      .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/'+paths.root}))

      .pipe(gulp.dest(paths.output + 'amd'))
      .pipe(gulp.dest(paths.output + 'system'))
      .pipe(gulp.dest(paths.output + 'commonjs'))
      .pipe(gulp.dest(paths.output + 'es6'));
})
