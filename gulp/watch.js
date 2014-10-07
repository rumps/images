'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task('rump:watch:images', ['rump:build:images'], function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.images,
                       rump.configs.main.globs.watch.images);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             ['rump:build:images']);
});

gulp.tasks['rump:watch'].dep.push('rump:watch:images');
