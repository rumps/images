'use strict';

var assert = require('better-assert');
var bufferEqual = require('buffer-equal');
var fs = require('graceful-fs');
var gulp = require('gulp');
var util = require('gulp-util');
var imageSize = require('image-size');
var any = require('lodash/collection/any');
var toArray = require('lodash/lang/toArray');
var path = require('path');
var sinon = require('sinon');
var rump = require('../lib');
var configs = require('../lib/configs');

describe('rump images tasks', function() {
  var original;

  before(function() {
    original = fs.readFileSync('test/src/image1.png');
  });

  beforeEach(function() {
    rump.configure({
      paths: {
        source: {
          root: 'test/src',
          images: ''
        },
        destination: {
          root: 'tmp',
          images: ''
        }
      }
    });
    configs.watch = false;
  });

  after(function() {
    fs.writeFileSync('test/src/image1.png', original);
  });

  it('are added and defined', function() {
    var callback = sinon.spy();
    rump.on('gulp:main', callback);
    rump.on('gulp:images', callback);
    rump.addGulpTasks({prefix: 'spec'});
    // TODO Remove no callback check on next major core update
    assert(!callback.called || callback.calledTwice);
    assert(gulp.tasks['spec:info:images']);
    assert(gulp.tasks['spec:build:images']);
    assert(gulp.tasks['spec:watch:images']);
  });

  it('info:images', function() {
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
      logs.push(util.colors.stripColor(toArray(arguments).join(' ')));
    };
    gulp.start('spec:info');
    console.log = oldLog;
    assert(any(logs, hasPaths));
    assert(any(logs, hasImageFile));
    assert(any(logs, hasRetinaImageFile));
  });

  it('build:images, watch:images', function(done) {
    gulp.task('postbuild', ['spec:watch'], function() {
      var size = imageSize('tmp/image2.jpg');
      var retinaSize = imageSize('tmp/image2@2x.jpg');
      assert(bufferEqual(fs.readFileSync('tmp/image1.png'), original));
      assert(size.width * 2 === retinaSize.width);
      assert(size.height * 2 === retinaSize.height);
      timeout(function() {
        fs.writeFileSync('test/src/image1.png',
                         fs.readFileSync('test/new/image1.png'));
        timeout(function() {
          assert(!bufferEqual(fs.readFileSync('tmp/image1.png'), original));
          rump.reconfigure({environment: 'production'});
          fs.writeFileSync('test/src/image1.png', original);
          timeout(function() {
            var sourceStat = fs.statSync('test/src/image1.png');
            var destinationStat = fs.statSync('tmp/image1.png');
            assert(sourceStat.size > destinationStat.size);
            done();
          }, 950);
        }, 950);
      }, 950);
    });
    gulp.start('postbuild');
  });
});

function hasImageFile(log) {
  return log === 'image1.png';
}

function hasRetinaImageFile(log) {
  return log === 'image2@2x.jpg *';
}

function hasPaths(log) {
  return ~log.indexOf(path.join('test', 'src')) && ~log.indexOf('tmp');
}

function timeout(cb, delay) {
  process.nextTick(function() {
    setTimeout(function() {
      process.nextTick(cb);
    }, delay || 0);
  });
}
