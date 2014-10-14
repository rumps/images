'use strict';

var extend = require('extend');
var rump = require('rump');

exports.rebuild = function() {
  rump.configs.main.globs = extend(true, {
    build: {
      images: '**/*.{gif,jpg,jpeg,png}'
    },
    watch: {
      images: '**/*.{gif,jpg,jpeg,png}'
    }
  }, rump.configs.main.globs);

  rump.configs.main.paths = extend(true, {
    source: {
      images: 'images'
    },
    destination: {
      images: 'images'
    }
  }, rump.configs.main.paths);
};

exports.rebuild();
