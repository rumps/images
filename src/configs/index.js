import extend from 'extend'
import rump from 'rump'

rebuild()

export function rebuild() {
  rump.configs.main.globs = extend(true, {
    build: {images: '**/*.{gif,jpg,jpeg,png,svg}'},
    watch: {images: '**/*.{gif,jpg,jpeg,png,svg}'},
  }, rump.configs.main.globs)
  rump.configs.main.paths = extend(true, {
    source: {images: 'images'},
    destination: {images: 'images'},
  }, rump.configs.main.paths)
  rump.configs.main.images = extend(true, {
    minify: rump.configs.main.environment === 'production',
  }, rump.configs.main.images)
}
