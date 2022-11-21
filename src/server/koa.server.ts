import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { Server } from 'http'

import { errorHandler } from '../middlewares/error.handler'
import api from '../routes/api'
import auth from '../routes/auth'
import root from '../routes/root'

export const runServer: () => Promise<Server> = async (): Promise<Server> => {
  const app: Koa = new Koa()
  app.use(errorHandler)
  app.use(bodyParser())
  app.use(root)
  app.use(auth)
  app.use(api)

  return app.listen(process.env.PORT)
}
