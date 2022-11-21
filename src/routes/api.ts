import Router from '@koa/router'

import jobs from './api/jobs'
import negotiations from './api/negotiations'
import users from './api/users'

export default new Router().prefix('/api').use(jobs).use(users).use(negotiations).routes()
