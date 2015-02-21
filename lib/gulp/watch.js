'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task(rump.taskName('watch:images'),
          [rump.taskName('build:images')],
          function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.images,
                       rump.configs.main.globs.watch.images);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             [rump.taskName('build:images')]);
});

gulp.tasks[rump.taskName('watch')].dep.push(rump.taskName('watch:images'));
