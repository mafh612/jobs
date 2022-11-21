import { createReadStream } from 'fs'
import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'

const root: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = createReadStream('view/index.html')
  ctx.set('Content-Type', 'text/html')

  return next()
}
const app: Middleware = async (ctx: Context, next: Next) => {
  switch (ctx.url) {
    case '/app.js':
      ctx.body = createReadStream('view/app.js')
      break
    case '/bootstrap.js':
      ctx.body = createReadStream('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
      break
    case '/bootstrap.bundle.min.js.map':
      ctx.body = createReadStream('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map')
      break
    default:
    // do nothing
  }
  ctx.set('Content-Type', 'application/javascript')

  return next()
}

export default new Router().get('/', root).get('/app.js', app).get('/bootstrap.js', app).get('/bootstrap.bundle.min.js.map', app).routes()
