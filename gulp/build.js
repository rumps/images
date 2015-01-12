'use strict';

var changed = require('gulp-changed');
var clone = require('gulp-clone');
var filter = require('gulp-filter');
var gm = require('gulp-gm');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rump = require('rump');
var util = require('gulp-util');

gulp.task(rump.taskName('build:images'), function() {
  var cloneSink = clone.sink();
  var minify = rump.configs.main.images.minify;
  var retinaFilter = filter(['**/*@2x.*']);
  var source = path.join(rump.configs.main.paths.source.root,
                         rump.configs.main.paths.source.images,
                         rump.configs.main.globs.build.images);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.images);

  return gulp
    .src([source].concat(rump.configs.main.globs.global))
    .pipe((rump.configs.watch ? plumber : util.noop)())
    .pipe((rump.configs.watch ? changed : util.noop)(destination))
    .pipe(retinaFilter)
    .pipe(cloneSink)
    .pipe(gm(function(gmfile, done) {
      done(null, gmfile.resize('50%', '50%'));
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace(/@2x$/, '');
    }))
    .pipe(retinaFilter.restore())
    .pipe(cloneSink.tap())
    .pipe((minify ? imagemin : util.noop)(rump.configs.main.images.imagemin))
    .pipe(gulp.dest(destination));
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:images'));
