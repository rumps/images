import '../src'
import bufferEqual from 'buffer-equal'
import gulp from 'gulp'
import imageSize from 'image-size'
import timeout from 'timeout-then'
import rump from 'rump'
import {colors} from 'gulp-util'
import {readFile, stat, writeFile} from 'mz/fs'
import {sep} from 'path'
import {spy} from 'sinon'

const {stripColor} = colors

describe('tasks', function() {
  this.timeout(0)

  beforeEach(() => {
    rump.configure({paths: {
      source: {root: 'test/fixtures/src', images: ''},
      destination: {root: 'tmp', images: ''},
    }})
  })

  it('are added and defined', () => {
    const callback = spy()
    rump.on('gulp:main', callback)
    rump.on('gulp:images', callback)
    rump.addGulpTasks({prefix: 'spec'})
    callback.should.be.calledTwice()
    gulp.tasks['spec:info:images'].should.be.ok()
    gulp.tasks['spec:build:images'].should.be.ok()
    gulp.tasks['spec:watch:images'].should.be.ok()
  })

  it('display correct information in info task', () => {
    const logs = [],
          {log} = console
    console.log = newLog
    gulp.start('spec:info')
    console.log = log
    logs.slice(-7).should.eql([
      '',
      '--- Images v0.7.0',
      `Images from test${sep}fixtures${sep}src are copied to tmp`,
      'Affected files (* - non-retina copies also generated):',
      'image1.png',
      'image2@2x.jpg *',
      '',
    ])
    logs.length = 0
    console.log = newLog
    gulp.start('spec:info:prod')
    console.log = log
    logs.slice(-7).should.eql([
      '',
      '--- Images v0.7.0',
      `Images from test${sep}fixtures${sep}src are minified and copied to tmp`,
      'Affected files (* - non-retina copies also generated):',
      'image1.png',
      'image2@2x.jpg *',
      '',
    ])
    rump.reconfigure({environment: 'development'})

    function newLog(...args) {
      logs.push(stripColor(args.join(' ')))
    }
  })

  describe('for building', () => {
    let original

    before(async() => {
      original = await readFile('test/fixtures/src/image1.png')
      await new Promise(resolve => {
        gulp.task('postbuild', ['spec:watch'], resolve)
        gulp.start('postbuild')
      })
    })

    beforeEach(() => timeout(1000))

    afterEach(() => writeFile('test/fixtures/src/image1.png', original))

    it('handles updates', async() => {
      let content = await readFile('tmp/image1.png')
      bufferEqual(original, await readFile('tmp/image1.png')).should.be.true()
      content = await readFile('test/fixtures/new/image1.png')
      await timeout(1000)
      await writeFile('test/fixtures/src/image1.png', content)
      await timeout(1000)
      bufferEqual(original, await readFile('tmp/image1.png')).should.be.false()
    })

    it('handles retina images', () => {
      const {width, height} = imageSize('tmp/image2.jpg'),
            retinaSize = imageSize('tmp/image2@2x.jpg')
      retinaSize.width.should.equal(width * 2)
      retinaSize.height.should.equal(height * 2)
    })

    it('handles minification in production', async() => {
      let sourceStat = await stat('test/fixtures/src/image1.png'),
          destinationStat = await stat('tmp/image1.png')
      sourceStat.size.should.equal(destinationStat.size)
      rump.reconfigure({environment: 'production'})
      await timeout(1000)
      await writeFile('test/fixtures/src/image1.png', original)
      await timeout(1000);
      [sourceStat, destinationStat] = await Promise.all([
        stat('test/fixtures/src/image1.png'),
        stat('tmp/image1.png'),
      ])
      sourceStat.size.should.be.above(destinationStat.size)
    })
  })
})
