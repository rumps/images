'use strict';

var globule = require('globule');
var gulp = require('gulp');
var path = require('path');
var rump = require('rump');
var util = require('gulp-util');

gulp.task('rump:info:images', function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.images,
                       rump.configs.main.globs.build.images);
  var files = globule.find([glob].concat(rump.configs.main.globs.global));
  var source = path.join(rump.configs.main.paths.source.root,
                         rump.configs.main.paths.source.images);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.images);

  util.log('Images are copied from', util.colors.green(source),
           'to', util.colors.green(destination));

  if(files.length) {
    util.log('Affected files',
             '(' + util.colors.yellow('*'),
             '- non-retina copies also generated):');
    files.forEach(function(file) {
      var message = util.colors.blue(path.relative(source, file));

      if(/@2x$/.test(path.basename(file))) {
        util.log(message, util.colors.yellow('*'));
      }
      else {
        util.log(message);
      }
    });
  }
});

gulp.tasks['rump:info'].dep.push('rump:info:images');
