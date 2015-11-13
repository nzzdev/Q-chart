var gulp  = require('gulp');
var es    = require('event-stream');
var gutil = require('gulp-util');
var AWS   = require('aws-sdk');
var env   = require('gulp-env');
var config = new AWS.Config({
  region: 'eu-west-1'
});
var s3 = require('gulp-s3-upload')(config);

if (!process.env.FASTLY_API_KEY || !process.env.S3_BUCKET) {
  env({
    file: ".env.json"
  });
}

var FastlyPurge = require('fastly-purge');
var fastlyPurge = new FastlyPurge(process.env.FASTLY_API_KEY);

var slug          = 'toolbox-tools/chart';
var deployTargets = [];

// deploy target is different according to branch / tags
if (process.env.TRAVIS_TAG) {
  deployTargets.push(slug + '-' + process.env.TRAVIS_TAG);
}
if (process.env.TRAVIS_BRANCH) {
  if (process.env.TRAVIS_BRANCH === 'master') {
    deployTargets.push(slug);
  } else {
    deployTargets.push(slug + '-' + process.env.TRAVIS_BRANCH);
  }
}

var fastlyPurgeCallback = function(err, result) {
  if (err) {
    gutil.log('fastlyPurgeError', err, result);
  } else {
    gutil.log('fastlyPurge', result);
  }
}

gulp.task('deploy', function() {
  for (var target of deployTargets) {
    console.log('deploying to ' + process.env.S3_BUCKET + '/' + target + '/')
    gulp.src("./deployable-build/**")
      .pipe(s3({
          Bucket: process.env.S3_BUCKET, //  Required
          ACL:    'public-read',         //  Needs to be user-defined
          keyTransform: function(relative_filename) {
            var new_name = target + '/' + relative_filename;
            return new_name;
          },
          onChange: function(keyname) {
            fastlyPurge.url('http://' + process.env.S3_BUCKET + '/' + keyname, fastlyPurgeCallback);
          }
      }))
    ;
  }

});

