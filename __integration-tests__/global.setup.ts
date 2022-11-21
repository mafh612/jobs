import { Server } from 'http'
import { MongoClient } from 'mongodb'
import { runServer } from '../src/server/koa.server'
import { runMongoDb } from '../src/services/mongodb.adapter'
import { execSync } from 'child_process'

declare global {
  var state: { mongoClient: MongoClient; server: Server }
}

// tslint:disable-next-line no-default-export
export default async (): Promise<void> => {
  process.env.MONGO_DB_CONNECTION_URI = 'mongodb://jobs:jobs@localhost:27017/admin?connectTimeoutMS=2000'
  process.env.MONGO_DB_DATABASE_NAME = 'jobs'
  process.env.PORT = '3000'
  process.env.SIGN_KEY = 'very_secret_key'

  execSync('docker-compose --project-name jobs -f .docker/docker-compose.yml up -d')
  const mongoClient: MongoClient = await runMongoDb().then((it: MongoClient) => {
    process.stdout.write('mongodb running')

    return it
  })
  const server: Server = await runServer().then((it: Server) => {
    process.stdout.write('server running')

    return it
  })

  global.state = {
    mongoClient,
    server
  }
}
