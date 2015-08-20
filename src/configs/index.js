import extend from 'extend'
import rump from 'rump'

const {configs} = rump

rebuild()

export function rebuild() {
  configs.main.globs = extend(true, {
    build: {images: '**/*.{gif,jpg,jpeg,png,svg}'},
    watch: {images: '**/*.{gif,jpg,jpeg,png,svg}'},
  }, configs.main.globs)
  configs.main.paths = extend(true, {
    source: {images: 'images'},
    destination: {images: 'images'},
  }, configs.main.paths)
  configs.main.images = extend(true, {
    minify: configs.main.environment === 'production',
    retina: false,
  }, configs.main.images)
}
