import AJV, { Schema } from 'ajv'
import addFormats from 'ajv-formats'
import yaml from 'yaml'
import _pick from 'lodash.pick'
import { readFileSync } from 'fs'
import { Context, Middleware, Next } from 'koa'
import { LogReason } from '../../shared'
import { logger } from '../utils'
import { HttpMethod } from 'http-enums'

const ajv: AJV = addFormats(new AJV({ removeAdditional: 'all' }))

const schemas = yaml.parse(readFileSync('config/application.schema.yml', { encoding: 'utf8' }))
schemas.forEach(({ name, schema }: { schema: Schema; name: string }) => {
  ajv.validateSchema(schema)
  ajv.addSchema(schema, name)
  ajv.addSchema(_pick(schema, ['properties', 'type']), `${name}_no_required`)
})

export const validateUser: Middleware = (ctx: Context, next: Next) => {
  validate('User', ctx.request.body, ctx.method !== HttpMethod.PATCH)

  return next()
}
export const validateJob: Middleware = (ctx: Context, next: Next) => {
  validate('Job', ctx.request.body, ctx.method !== HttpMethod.PATCH)

  return next()
}

export const validateNegotiation: Middleware = (ctx: Context, next: Next) => {
  validate('Negotiation', ctx.request.body, ctx.method !== HttpMethod.PATCH)

  return next()
}

const validate = (schema: string, data: unknown, required: boolean = true) => {
  const validation = ajv.validate(required ? schema : `${schema}_no_required`, data)
  if (!validation || ajv.errors?.length) {
    logger.error(ajv.errors)
    throw new Error(LogReason.VALIDATION)
  }
}
