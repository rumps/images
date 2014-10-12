'use strict';

var chalk = require('chalk');
var globule = require('globule');
var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task('rump:info:images', function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.images,
                       rump.configs.main.globs.build.images);
  var files = globule.find([glob].concat(rump.configs.main.globs.global));
  var source = path.join(rump.configs.main.paths.source.root,
                         rump.configs.main.paths.source.images);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.images);
  var action = rump.configs.main.environment === 'production' ?
    chalk.yellow('minified') + ' and copied' :
    'copied';

  if(!files.length) {
    return;
  }

  console.log();
  console.log(chalk.magenta('--- Images'));
  console.log('Images from', chalk.green(source),
              'are', action,
              'to', chalk.green(destination));
  console.log('Affected files',
              '(' + chalk.yellow('*'),
              '- non-retina copies also generated):');
  files.forEach(function(file) {
    var message = chalk.blue(path.relative(source, file));
    if(/@2x$/.test(path.basename(file, path.extname(file)))) {
      console.log(message, chalk.yellow('*'));
    }
    else {
      console.log(message);
    }
  });

  console.log();
});

gulp.tasks['rump:info'].dep.push('rump:info:images');
