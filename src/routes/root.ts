import yaml from 'yaml'
import { createReadStream, readFileSync } from 'fs'
import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'

const root: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = createReadStream('view/swagger/index.html')
  ctx.set('Content-Type', 'text/html')

  return next()
}

const resources: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = createReadStream(`view/swagger${ctx.path.replace('/documentation/ui', '')}`)
  ctx.set('Content-Type', ctx.path.endsWith('js') ? 'text/javascript' : 'text/css')

  return next()
}

const documenation: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = yaml.parse(readFileSync('config/api.doc.yml', { encoding: 'utf8' }))
  ctx.set('Content-Type', 'text/html')

  return next()
}

export default new Router()
  .get('/', root)
  .get('/documentation/ui/swagger-ui.css', resources)
  .get('/documentation/ui/swagger-ui-bundle.js', resources)
  .get('/documentation/ui/swagger-ui-standalone-preset.js', resources)
  .get('/documentation/ui/oaspec.json', documenation)
  .routes()
