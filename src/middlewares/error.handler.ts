import { HttpStatus } from 'http-enums'
import { Context, Next, Middleware } from 'koa'
import { logger } from '../utils/logger'

export const errorHandler: Middleware = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    logger.error(err.message, { ...err })

    ctx.body = {
      name: err.name,
      message: err.message
    }
    ctx.set('Content-Type', 'application/json')

    switch (err.name) {
      case HttpStatus.BAD_REQUEST.toString():
        ctx.status = HttpStatus.BAD_REQUEST
        break
      case HttpStatus.UNAUTHORIZED.toString():
        ctx.status = HttpStatus.UNAUTHORIZED
        break
      case HttpStatus.FORBIDDEN.toString():
        ctx.status = HttpStatus.FORBIDDEN
        break
      default:
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
