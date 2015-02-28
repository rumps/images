'use strict';

// Temporary fix until old LoDash is updated in some Gulp dependency
Object.getPrototypeOf.toString = function() {
  return 'function getPrototypeOf() { [native code] }';
};

var assert = require('assert');
var bufferEqual = require('buffer-equal');
var co = require('co');
var fs = require('mz/fs');
var gulp = require('gulp');
var util = require('gulp-util');
var imageSize = require('image-size');
var path = require('path');
var sinon = require('sinon');
var sleep = require('timeout-then');
var rump = require('../lib');

describe('rump images tasks', function() {
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
  });

  it('are added and defined', function() {
    this.timeout(12000);
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

  it('display correct information in info task', function() {
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
      logs.push(util.colors.stripColor(Array.from(arguments).join(' ')));
    };
    gulp.start('spec:info');
    console.log = oldLog;
    assert(logs.some(hasPaths));
    assert(logs.some(hasImageFile));
    assert(logs.some(hasRetinaImageFile));
  });

  describe('for building', function() {
    var original;

    before(co.wrap(function*() {
      original = yield fs.readFile('test/src/image1.png');
    }));

    before(function(done) {
      gulp.task('postbuild', ['spec:watch'], function() {
        done();
      });
      gulp.start('postbuild');
    });

    afterEach(co.wrap(function*() {
      yield sleep(800);
      yield fs.writeFile('test/src/image1.png', original);
      yield sleep(800);
    }));

    it('handles updates', co.wrap(function*() {
      var content = yield fs.readFile('tmp/image1.png');
      assert(bufferEqual(content, original));
      content = yield fs.readFile('test/new/image1.png');
      yield sleep(800);
      yield fs.writeFile('test/src/image1.png', content);
      yield sleep(800);
      content = yield fs.readFile('tmp/image1.png');
      assert(!bufferEqual(original, content));
    }));

    it('handles retina images', function() {
      var size = imageSize('tmp/image2.jpg');
      var retinaSize = imageSize('tmp/image2@2x.jpg');
      assert(size.width * 2 === retinaSize.width);
      assert(size.height * 2 === retinaSize.height);
    });

    it('handles minification in production', co.wrap(function*() {
      var sourceStat = yield fs.stat('test/src/image1.png');
      var destinationStat = yield fs.stat('tmp/image1.png');
      assert(sourceStat.size === destinationStat.size);
      rump.reconfigure({environment: 'production'});
      yield sleep(800);
      yield fs.writeFile('test/src/image1.png', original);
      yield sleep(800);
      sourceStat = yield fs.stat('test/src/image1.png');
      destinationStat = yield fs.stat('tmp/image1.png');
      assert(sourceStat.size > destinationStat.size);
    }));
  });
});

function hasImageFile(log) {
  return log === 'image1.png';
}

function hasRetinaImageFile(log) {
  return log === 'image2@2x.jpg *';
}

function hasPaths(log) {
  return log.includes(path.join('test', 'src')) && log.includes('tmp');
}
