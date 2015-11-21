var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('link', function (cb) {
  exec('jspm link github:nzzdev/Q-chart@dev -y', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})
