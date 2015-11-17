var gulp  = require('gulp');
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
  deployTargets.push(slug + '-releases/' + process.env.TRAVIS_TAG + '/');

  // deploy to masked version folders e.g. 0.2.* and 0.*.*
  if (process.env.TRAVIS_TAG.indexOf('.') >= 0) {
    var versionDigits = process.env.TRAVIS_TAG.split('.');
    deployTargets.push(slug + '-releases/' + versionDigits[0] + '.' + versionDigits[1] + '.*' + '/');
    deployTargets.push(slug + '-releases/' + versionDigits[0] + '.*.*' + '/');
  }

  // If we have a tagged release on master, we deploy this to the live production environment
  if (process.env.TRAVIS_BRANCH && process.env.TRAVIS_BRANCH === 'master') {
    deployTargets.push(slug);
  }
}

if (process.env.TRAVIS_BRANCH) {
  deployTargets.push(slug + '-' + process.env.TRAVIS_BRANCH);
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

