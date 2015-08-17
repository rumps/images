import gulp, {tasks} from 'gulp'
import changed from 'gulp-changed'
import clone from 'gulp-clone'
import filter from 'gulp-filter'
import gm from 'gulp-gm'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import rump from 'rump'
import {noop} from 'gulp-util'
import {join} from 'path'

const dest = ::gulp.dest,
      name = ::rump.taskName,
      src = ::gulp.src,
      task = ::gulp.task,
      {configs} = rump

task(name('build:images'), () => {
  const cloneSink = clone.sink(),
        retinaFilter = filter(['**/*@2x.*'], {restore: true}),
        source = join(configs.main.paths.source.root,
                      configs.main.paths.source.images,
                      configs.main.globs.build.images),
        destination = join(rump.configs.main.paths.destination.root,
                           rump.configs.main.paths.destination.images),
        {minify} = configs.main.images
  return src([source].concat(configs.main.globs.global))
    .pipe((rump.configs.watch ? plumber : noop)())
    .pipe((rump.configs.watch ? changed : noop)(destination))
    .pipe(retinaFilter)
    .pipe(cloneSink)
    .pipe(gm((gmfile, done) => done(null, gmfile.resize('50%', '50%'))))
    .pipe(rename(path => path.basename = path.basename.replace(/@2x$/, '')))
    .pipe(retinaFilter.restore)
    .pipe(cloneSink.tap())
    .pipe((minify ? imagemin : noop)(configs.main.images.imagemin))
    .pipe(dest(destination))
})

tasks[name('build')].dep.push(name('build:images'))
