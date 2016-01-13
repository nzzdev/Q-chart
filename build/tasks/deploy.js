var gulp  = require('gulp');
var gutil = require('gulp-util');
var AWS   = require('aws-sdk');
var env   = require('gulp-env');
var fs    = require('fs');
var makeSlug = require('slug');
var config = new AWS.Config({
  region: 'eu-west-1'
});
var s3 = require('gulp-s3-upload')(config);

if (!process.env.KEYCDN_API_KEY || !process.env.S3_BUCKET) {
  var envFile = '.env.json';
  try {
    stats = fs.lstatSync(envFile);
    if (stats.isFile()) {
      env({
        file: envFile
      });
    }
  } catch(e) {
    console.log('No env file found, you won\'t be able to deploy, which is ok. Travis will do it for you.');
  }
}

var keycdn = require('gulp-keycdn');
var keycdnOptions = {
  apiKey  : process.env.KEYCDN_API_KEY,
  zoneId  : process.env.KEYCDN_ZONE_ID,
  method : 'del'
};

var slug          = 'Q-renderers/chart';
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

deployTargets.push(slug + '-dev');

function createDeployTask(name, target) {
  gulp.task(name, function() {
     return gulp.src("./deployable-build/**")
      .pipe(s3({
        Bucket: process.env.S3_BUCKET, //  Required
        ACL:    'public-read',         //  Needs to be user-defined
        maps: {
          CacheControl: function(keyname) {
            return 'public, max-age=360';
          }
        },
        keyTransform: function(relative_filename) {
          var new_name = target + '/' + relative_filename;
          return new_name;
        },
        onChange: function(keyname) {
          keycdn(keycdnOptions, [process.env.KEYCDN_ZONE_URL + '/' + keyname]);
        },
        onNew: function(keyname) {
          keycdn(keycdnOptions, [process.env.KEYCDN_ZONE_URL + '/' + keyname]);
        }
    }));
  });
}

var deployTasks = [];

for (var target of deployTargets) {
  var taskName = makeSlug('deploy-'+target);
  createDeployTask(taskName, target);
  deployTasks.push(taskName);
}

gulp.task('deploy', deployTasks);
