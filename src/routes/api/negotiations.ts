import { Context, Next } from 'koa'
import Router, { Middleware } from '@koa/router'
import _pick from 'lodash.pick'

import {
  createNegotiation,
  deleteNegotiation,
  findAllNegotiation,
  findOneNegotiation,
  replaceNegotiation,
  updateNegotiation
} from '../../services/mongodb.negotiation.service'
import { findOneJob } from '../../services/mongodb.job.service'
import { findOneUser } from '../../services/mongodb.user.service'
import { Role, Negotiation, Employer, Employee, Job } from '../../../shared'
import { validateNegotiation } from '../../middlewares/validate'
import { Filter, ObjectId, WithId } from 'mongodb'
import { security } from '../../middlewares/security'

const resolveNegotiation = async (negotiation: Negotiation): Promise<Negotiation> => {
  const [employer, employee, job]: [Employer, Employee, Job] = await Promise.all([
    findOneUser({ _id: new ObjectId(negotiation.employer.toString()) }) as unknown as Employer,
    findOneUser({ _id: new ObjectId(negotiation.employee.toString()) }) as unknown as Employee,
    findOneJob({ _id: new ObjectId(negotiation.job.toString()) })
  ])

  return { ...negotiation, employer, employee, job }
}

const getAll: Middleware = async (ctx: Context, next: Next) => {
  const negotiations: Negotiation[] = await findAllNegotiation({
    $or: [{ employee: ctx.state.auth.jti }, { employer: ctx.state.auth.jti }]
  })

  ctx.body = await Promise.all(negotiations.map(resolveNegotiation))

  return next()
}
const get: Middleware = async (ctx: Context, next: Next) => {
  const filter: Filter<WithId<Negotiation>> = { _id: new ObjectId(ctx.params.id) }
  const negotiation: Negotiation = await findOneNegotiation(filter)

  ctx.body = await resolveNegotiation(negotiation)

  return next()
}
const save: Middleware = async (ctx: Context, next: Next) => {
  const doc: Negotiation = ctx.request.body as Negotiation
  ctx.body = await createNegotiation(doc as Negotiation)

  return next()
}
const update: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)
  const doc: Partial<Negotiation> = ctx.request.body

  switch (ctx.state.auth.role) {
    case Role.ADMIN:
      ctx.body = await updateNegotiation({ _id }, doc)
    case Role.EMPLOYEE:
      ctx.body = await updateNegotiation({ _id }, _pick(doc, ['hasApplied', 'hasAccepted']))
    case Role.EMPLOYER:
      ctx.body = await updateNegotiation({ _id }, _pick(doc, ['isInvited']))
    default:
    // do nothing
  }

  return next()
}
const replace: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)
  const doc: Negotiation = ctx.request.body as Negotiation

  ctx.body = await replaceNegotiation({ _id }, doc)

  return next()
}
const del: Middleware = async (ctx: Context, next: Next) => {
  const _id: ObjectId = new ObjectId(ctx.params.id)

  ctx.body = await deleteNegotiation({ _id })

  return next()
}

export default new Router()
  .prefix('/negotiations')
  .get('/', security(), getAll)
  .get('/:id', security(), get)
  .post('/', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), validateNegotiation, save)
  .patch('/:id', security(Role.EMPLOYEE, Role.EMPLOYER, Role.ADMIN), validateNegotiation, update)
  .put('/:id', security(Role.ADMIN), validateNegotiation, replace)
  .delete('/:id', security(), del)
  .routes()
