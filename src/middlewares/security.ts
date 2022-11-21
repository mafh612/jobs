import { HttpRequestHeader, HttpStatus } from 'http-enums'
import { Context, Middleware, Next } from 'koa'
import { verify } from 'jsonwebtoken'
import { Role, Payload } from '../../shared'

export const security =
  (...roles: Role[]): Middleware =>
  (ctx: Context, next: Next) => {
    const { SIGN_KEY }: { [key: string]: string } = process.env
    const token = ctx.get(HttpRequestHeader.AUTHORIZATION) || ctx.cookies.get(HttpRequestHeader.AUTHORIZATION)
    let error: Error

    if (!token) {
      error = new Error('UNAUTHORIZED')
      error.name = HttpStatus.UNAUTHORIZED.toString()
      error.message = 'token missing'

      throw error
    }

    const payload: Payload = verify(token, SIGN_KEY, { complete: false }) as Payload

    if (!payload) {
      error = new Error('UNAUTHORIZED')
      error.name = HttpStatus.UNAUTHORIZED.toString()
      error.message = 'token invalid'
    }

    ctx.state.auth = payload

    if (roles.length && !roles.includes(payload?.role)) {
      error = new Error('FORBIDDEN')
      error.name = HttpStatus.FORBIDDEN.toString()
      error.message = 'access not allowed'
    }

    if (error) throw error

    return next()
  }
