# Rump Images
[![NPM](http://img.shields.io/npm/v/rump-images.svg?style=flat-square)](https://www.npmjs.org/package/rump-images)
![License](http://img.shields.io/npm/l/rump-images.svg?style=flat-square)
[![Issues](https://img.shields.io/github/issues/rumps/issues.svg?style=flat-square)](https://github.com/rumps/issues/issues)


## Status

### Master
[![Dependencies](http://img.shields.io/david/rumps/images.svg?style=flat-square)](https://david-dm.org/rumps/images)
[![Dev Dependencies](http://img.shields.io/david/dev/rumps/images.svg?style=flat-square)](https://david-dm.org/rumps/images#info=devDependencies)
<br>
[![Travis](http://img.shields.io/travis/rumps/images.svg?style=flat-square&label=travis)](https://travis-ci.org/rumps/images)
[![Appveyor](http://img.shields.io/appveyor/ci/jupl/rump-images.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/jupl/rump-images)
[![Codecov](http://img.shields.io/codecov/c/github/rumps/images.svg?style=flat-square&label=codecov)](https://codecov.io/github/rumps/images?view=all)

### Develop
[![Dependencies](http://img.shields.io/david/rumps/images/develop.svg?style=flat-square)](https://david-dm.org/rumps/images/develop)
[![Dev Dependencies](http://img.shields.io/david/dev/rumps/images/develop.svg?style=flat-square)](https://david-dm.org/rumps/images/develop#info=devDependencies)
<br>
[![Travis](http://img.shields.io/travis/rumps/images/develop.svg?style=flat-square&label=travis)](https://travis-ci.org/rumps/images)
[![Appveyor](http://img.shields.io/appveyor/ci/jupl/rump-images/develop.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/jupl/rump-images)
[![Codecov](http://img.shields.io/codecov/c/github/rumps/images/develop.svg?style=flat-square&label=codecov)](https://codecov.io/github/rumps/images?branch=develop&view=all)


## About
Rump Images is a Rump module that handles images with support for image
optimizations via [imagemin](https://github.com/imagemin/imagemin) and high
density "retina" images. (retina support requires
[GraphicsMagick](http://www.graphicsmagick.org/)) For more information, visit
the [core repository](https://github.com/rumps/core).


## API
The following is appended to the core Rump API:

### `rump.addGulpTasks(options)`
This module adds the following tasks:

- `build:images` will process and copy images from source to destination. This
task is also added to the `build` task. Images that end with `@2x`
(`logo@2x.png`) will have copies made without the `@2x` (`logo.png`) and at
half the resolution of the original. For more information on source and
destination paths see `rump.configure()` below. This task is also added to the
`build` task.
- `watch:images` will run `build:images`, then monitor for changes and process
updated files as needed. This task is also added to the `watch` task.
- `info:images` will display information on what this specific module does,
specifically the source and destination paths as well as what files would get
processed as well as those that would get retina copies. This task is also
added to the `info` task.

### `rump.configure(options)`
Redefine options for Rump and Rump modules to follow. In addition to what
options Rump and other Rump modules offer, the following options are
available alongside default values:

#### `options.images.minify` (`options.environment === 'production'`)
This specifies whether to process images through imagemin. (processed if
`true`) By default images are minified only if the environment is set to
production. (visit the main Rump repository for more information on
environment)

#### `options.images.retina` (`false`)
This specifies whether to create non-retina version of images. (denoted by
`@2x`) By default this option is turned off. (If you turn on
[GraphicsMagick](http://www.graphicsmagick.org/) is required)

#### `options.images.imagemin`
This specifies additional options for
[gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin).

#### `options.paths.source.images` (`'images'`)
This is the directory where images to be copied are contained. This path is
relative to the root source path. (If the default root and images path is used,
then the path would be `src/images`)

#### `options.paths.destination.images` (`'images'`)
This is the directory where images are copied to. This path is relative to the
root destination path. (If the default root and images path is used, then the
path would be `dist/images`)

#### `options.globs.build.images` (`'**/*.{gif,jpg,jpeg,png,svg}'`)
This specifies which images to process. By default it processes all
GIF/JPEG/PNG/SVG images, including those in subdirectories.

#### `options.globs.watch.images` (`'**/*.{gif,jpg,jpeg,png,svg}'`)
This specifies which images to monitor for changes. By default it watches all
GIF/JPEG/PNG/SVG images, including those in subdirectories.
