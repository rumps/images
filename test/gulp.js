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

describe('tasks', () => {
  this.timeout(0)

  beforeEach(() => {
    rump.configure({paths: {
      source: {root: 'test/src', images: ''},
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
    console.log = (...args) => logs.push(stripColor(args.join(' ')))
    gulp.start('spec:info')
    console.log = log
    logs.slice(-7).should.eql([
      '',
      '--- Images v0.7.0',
      `Images from test${sep}src are copied to tmp`,
      'Affected files (* - non-retina copies also generated):',
      'image1.png',
      'image2@2x.jpg *',
      '',
    ])
  })

  describe('for building', () => {
    let original

    before(async(done) => {
      original = await readFile('test/src/image1.png')
      gulp.task('postbuild', ['spec:watch'], () => done())
      gulp.start('postbuild')
    })

    afterEach(async() => {
      await timeout(1000)
      await writeFile('test/src/image1.png', original)
      await timeout(1000)
    })

    it('handles updates', async() => {
      let content = await readFile('tmp/image1.png')
      bufferEqual(content, original).should.be.true()
      content = await readFile('test/new/image1.png')
      await timeout(1000)
      await writeFile('test/src/image1.png', content)
      await timeout(1000)
      content = await readFile('tmp/image1.png')
      bufferEqual(original, content).should.be.false()
    })

    it('handles retina images', () => {
      const {width, height} = imageSize('tmp/image2.jpg'),
            retinaSize = imageSize('tmp/image2@2x.jpg')
      retinaSize.width.should.equal(width * 2)
      retinaSize.height.should.equal(height * 2)
    })

    it('handles minification in production', async() => {
      let sourceStat = await stat('test/src/image1.png'),
          destinationStat = await stat('tmp/image1.png')
      sourceStat.size.should.equal(destinationStat.size)
      rump.reconfigure({environment: 'production'})
      await timeout(1000)
      await writeFile('test/src/image1.png', original)
      await timeout(1000)
      sourceStat = await stat('test/src/image1.png')
      destinationStat = await stat('tmp/image1.png')
      sourceStat.size.should.be.above(destinationStat.size)
    })
  })
})
