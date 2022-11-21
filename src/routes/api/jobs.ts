import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'

import { findAllJob, createJob, deleteJob, findOneJob, replaceJob, updateJob } from '../../services/mongodb.job.service'
import { Role, Job } from '../../../shared'
import { validateJob } from '../../middlewares/validate'
import { ObjectId } from 'mongodb'
import { security } from '../../middlewares/security'

const getAll: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = await findAllJob({})

  return next()
}
const get: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)

  ctx.body = await findOneJob({ _id })

  return next()
}
const save: Middleware = async (ctx: Context, next: Next) => {
  const doc: Job = ctx.request.body as Job

  ctx.body = await createJob(doc as Job)

  return next()
}
const update: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)
  const doc: Partial<Job> = ctx.request.body

  ctx.body = await updateJob({ _id }, doc)

  return next()
}
const replace: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)
  const doc: Job = ctx.request.body as Job

  ctx.body = await replaceJob({ _id }, doc)

  return next()
}
const del: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)

  ctx.body = await deleteJob({ _id })

  return next()
}

export default new Router()
  .prefix('/jobs')
  .get('/', security(), getAll)
  .get('/:id', security(), get)
  .post('/', security(Role.EMPLOYER, Role.ADMIN), validateJob, save)
  .patch('/:id', security(Role.EMPLOYER, Role.ADMIN), validateJob, update)
  .put('/:id', security(Role.EMPLOYER, Role.ADMIN), validateJob, replace)
  .delete('/:id', security(Role.EMPLOYER, Role.ADMIN), del)
  .routes()
