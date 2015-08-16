import gulp, {tasks} from 'gulp'
import rump from 'rump'
import {find} from 'globule'
import {colors} from 'gulp-util'
import {basename, extname, join, relative} from 'path'
import {version} from '../../package'

const name = ::rump.taskName,
      task = ::gulp.task,
      {blue, green, magenta, yellow} = colors,
      {configs} = rump

task(name('info:images'), () => {
  const glob = join(configs.main.paths.source.root,
                    configs.main.paths.source.images,
                    configs.main.globs.build.images),
        files = find([glob].concat(configs.main.globs.global)),
        source = join(configs.main.paths.source.root,
                      configs.main.paths.source.images),
        destination = join(configs.main.paths.destination.root,
                           configs.main.paths.destination.images),
        action = configs.main.environment === 'production'
          ? `${yellow('minified')} and copied`
          : 'copied'
  if(!files.length) {
    return
  }
  console.log()
  console.log(magenta(`--- Images v${version}`))
  console.log(`Images from ${green(source)} are ${action}`,
              `to ${green(destination)}`)
  console.log('Affected files',
              `(${yellow('*')} - non-retina copies also generated):`)
  files.forEach(file => {
    const message = blue(relative(source, file))
    if(/@2x$/.test(basename(file, extname(file)))) {
      console.log(`${message} ${yellow('*')}`)
    }
    else {
      console.log(message)
    }
  })
  console.log()
})

tasks[name('info')].dep.push(name('info:images'))
