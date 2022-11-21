import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'

import { findAllUser, createUser, deleteUser, replaceUser, updateUser, findOneUser } from '../../services/mongodb.user.service'
import { Role, User } from '../../../shared'
import { validateUser } from '../../middlewares/validate'
import { Filter, WithId } from 'mongodb'
import { security } from '../../middlewares/security'

const getAll: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = await findAllUser({})

  return next()
}
const get: Middleware = async (ctx: Context, next: Next) => {
  const filter: Filter<WithId<User>> = ctx.params

  ctx.body = await findOneUser(filter)

  return next()
}
const save: Middleware = async (ctx: Context, next: Next) => {
  const doc: User = ctx.request.body as User

  ctx.body = await createUser(doc as User)

  return next()
}
const update: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email
  const doc: Partial<User> = ctx.request.body

  ctx.body = await updateUser({ email }, doc)

  return next()
}
const replace: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email
  const doc: User = ctx.request.body as User

  ctx.body = await replaceUser({ email }, doc)

  return next()
}
const del: Middleware = async (ctx: Context, next: Next) => {
  const email: string = ctx.params.email

  ctx.body = await deleteUser({ email })

  return next()
}

export default new Router()
  .prefix('/users')
  .get('/', security(Role.EMPLOYER, Role.ADMIN), getAll)
  .get('/:email', security(Role.EMPLOYER, Role.ADMIN), get)
  .post('/', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), validateUser, save)
  .patch('/:email', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), validateUser, update)
  .put('/:email', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), validateUser, replace)
  .delete('/:email', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), del)
  .routes()
