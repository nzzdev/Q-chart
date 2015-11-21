var gulp = require('gulp');
var paths = require('../paths');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');


// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('build-and-link', function(callback) {
  return runSequence(
    'build',
    'link',
    callback
  );
});

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', ['serve'], function() {
  gulp.watch(paths.source, ['build-and-link', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.html, ['build-and-link', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.style, ['build-and-link', browserSync.reload]).on('change', reportChange);
});
