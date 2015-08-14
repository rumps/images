import gulp, {tasks} from 'gulp'
import rump from 'rump'
import {join} from 'path'

const {configs} = rump,
      name = ::rump.taskName,
      task = ::gulp.task,
      watch = ::gulp.watch

task(name('watch:images'), [name('build:images')], () => {
  const glob = join(configs.main.paths.source.root,
                    configs.main.paths.source.images,
                    configs.main.globs.watch.images)
  watch([glob].concat(configs.main.globs.global), [name('build:images')])
})

tasks[rump.taskName('watch')].dep.push(rump.taskName('watch:images'))
