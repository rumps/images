'use strict';

var merge = require('merge');
var rump = require('rump');

exports.rebuild = function() {
  rump.configs.main.globs = merge.recursive({
    build: {
      images: '*.{gif,jpg,jpeg,png}'
    },
    watch: {
      images: '**/*.{gif,jpg,jpeg,png}'
    }
  }, rump.configs.main.globs);

  rump.configs.main.paths = merge.recursive({
    source: {
      images: 'images'
    },
    destination: {
      images: 'images'
    }
  }, rump.configs.main.paths);
};

exports.rebuild();
