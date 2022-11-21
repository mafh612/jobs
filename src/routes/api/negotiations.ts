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
import { Role, Negotiation, Employer, Employee, Job, Payload } from '../../../shared'
import { validateNegotiation } from '../../middlewares/validate'
import { Filter, ObjectId, WithId } from 'mongodb'
import { security } from '../../middlewares/security'
import { ForbiddenError } from '../../utils/forbidden.error'

const checkUser: Middleware = async (ctx: Context & { state: { auth: Payload } }, next: Next): Promise<void> => {
  const negotiations: WithId<Negotiation>[] = (await findAllNegotiation({
    $or: [{ employee: ctx.state.auth.jti }, { employer: ctx.state.auth.jti }]
  })) as WithId<Negotiation>[]

  if (!negotiations.some((it: WithId<Negotiation>) => it._id.toString() === ctx.params.id) && ctx.state.auth.role !== Role.ADMIN) {
    throw new ForbiddenError()
  }

  return next()
}

const resolveNegotiation: Middleware = async (
  ctx: Context & { state: { negotiation: Negotiation; negotiations: Negotiation[] } },
  next: Next
): Promise<void> => {
  const resolve = async (negotiation: Negotiation): Promise<Negotiation> => {
    const [employer, employee, job]: [Employer, Employee, Job] = await Promise.all([
      findOneUser({ _id: new ObjectId(negotiation.employer.toString()) }) as unknown as Employer,
      findOneUser({ _id: new ObjectId(negotiation.employee.toString()) }) as unknown as Employee,
      findOneJob({ _id: new ObjectId(negotiation.job.toString()) })
    ])

    return { ...negotiation, employer, employee, job }
  }

  if (ctx.state.negotiation) {
    ctx.body = await resolve(ctx.state.negotiation)
  } else if (ctx.state.negotiations) {
    ctx.body = await Promise.all(ctx.state.negotiations.map(resolve))
  } else {
    ctx.body = []
  }

  return next()
}

const getAll: Middleware = async (ctx: Context, next: Next) => {
  ctx.body = ctx.state.negotiations = await findAllNegotiation({
    $or: [{ employee: ctx.state.auth.jti }, { employer: ctx.state.auth.jti }]
  })

  return next()
}
const get: Middleware = async (ctx: Context, next: Next) => {
  const filter: Filter<WithId<Negotiation>> = { _id: new ObjectId(ctx.params.id) }

  ctx.body = ctx.state.negotiation = await findOneNegotiation(filter)

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
  .get('/resolved', security(), getAll, resolveNegotiation)
  .get('/:id', security(), get)
  .get('/:id/resolved', security(), get, resolveNegotiation)
  .post('/', security(), validateNegotiation, save)
  .patch('/:id', security(), validateNegotiation, checkUser, update)
  .put('/:id', security(), validateNegotiation, checkUser, replace)
  .delete('/:id', security(), checkUser, del)
  .routes()
