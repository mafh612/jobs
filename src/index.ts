import { runServer } from './server/koa.server'
import { runMongoDb } from './services/mongodb.adapter'

runMongoDb().then(runServer)
